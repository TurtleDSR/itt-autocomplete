import * as syncfs from 'fs';
import { promises as fs } from 'fs';
import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { streamObject } from 'stream-json/streamers/stream-object.js';
import { Scriptsdump } from './dump/scriptsdump.ts';
import { Bindsdump } from './dump/bindsdump.ts';
import * as raw from './dump/scriptsdump.ts';
import * as bind from './dump/bindsdump.ts';
import * as out from './interface.ts';

async function parse_scripts_dump() : Promise<Scriptsdump> {
  const pipeline = chain([
    syncfs.createReadStream("dump/scripts.json"),
    parser(),
    streamObject.streamObject(),
  ]);

  const result: Partial<Scriptsdump> = {};

  return new Promise((reslove, reject) => {
    pipeline.on('data', ({key, value}: {key: string; value: unknown}) => {
      (result as Record<string, unknown>)[key] = value;
    });

    pipeline.on('end', () => reslove(result as Scriptsdump));
    pipeline.on('error', (err) => reject(err));
  });
}

async function parse_binds_dump() : Promise<Bindsdump> {
  const pipeline = chain([
    syncfs.createReadStream("dump/binds.json"),
    parser(),
    streamObject.streamObject(),
  ]);

  const result: Partial<Bindsdump> = {};

  return new Promise((reslove, reject) => {
    pipeline.on('data', ({key, value}: {key: string; value: unknown}) => {
      (result as Record<string, unknown>)[key] = value;
    });

    pipeline.on('end', () => reslove(result as Bindsdump));
    pipeline.on('error', (err) => reject(err));
  });
}

async function parse(scriptsdump : Scriptsdump, bindsdump : Bindsdump) {
  let info : out.as_info = {
    Type : [],
    Enum : [],
    Function : [],
    Variable : [],
  };

  //SCRIPTS
  scriptsdump.Modules.forEach((module) => {
    const module_name : string = module.Value.ModuleName;

    //functions
    module.Value.Functions.forEach((function_data) => {
      const func : out.Function = script_getFunctionInfo(scriptsdump, function_data, module_name);
      if(func.ReturnType !== func.Name) {info.Function.push(func);} //non-constructor
    });

    //classes
    module.Value.Classes.forEach((type_data) => {
      info.Type.push(getTypeInfo(scriptsdump, type_data, module_name));
    });

    //enums
    module.Value.Enums.forEach((enum_data) => {
      info.Enum.push(script_getEnumInfo(enum_data, module_name));
    });

    //properties
    module.Value.GlobalVariables.forEach((var_data) => {
      info.Variable.push(script_getVariableInfo(scriptsdump, var_data, module_name));
    });
  });

  //BINDS
  bindsdump.Structs.forEach((struct_data) => {
    info.Type.push(bind_getStructInfo(struct_data));
  });

  bindsdump.Classes.forEach((class_data) => {
    const class_info : out.Type = bind_getClassInfo(class_data);
    if(class_info.Name !== "__STATIC_") {
      info.Type.push(class_info);
    } else {
      class_info.Methods?.forEach((method) => {
        info.Function.push(method);
      });
    }
  });

  await fs.writeFile("compiled_dump/as_info.json", JSON.stringify(info, null, 2));
}

function getTypeInfo(dump : Scriptsdump, type_data : raw.Class, module: string) : out.Type {
  let type_info : out.Type = {
    Module : module,
    Name : type_data.ClassName,
  };
      
  if(type_data.Namespace !== "") {
    type_info.Namespace = type_data.Namespace;
  }

  //get methods
  type_data.Methods.forEach((function_data) => {
    if(!type_info.Methods) {type_info.Methods = [];}
    type_info.Methods.push(script_getFunctionInfo(dump, function_data, module));
  });

  //get constructors
  type_data.Factories.forEach((factory) => {
    if(!type_info.Constructors) {type_info.Constructors = [];}
    type_info.Constructors.push(script_getFunctionInfo(dump, factory, module));
  });

  //get properties
  type_data.Properties.forEach((property) => {
    const prop : out.Variable | undefined = script_getPropertyInfo(dump, property, module);
    if(!type_info.Properties) {type_info.Properties = [];}
    if(prop) {type_info.Properties.push(prop);}
  });

  return type_info;
}

function script_getFunctionInfo(dump : Scriptsdump, function_data : raw.Function, module : string) : out.Function {
  let function_info : out.Function = {
    Module : module,
    Name : "",
    ReturnType : ""
  };

  if(function_data.UnrealFunctionName) {
    function_info.Name = function_data.UnrealFunctionName;
  } else {
    function_info.Name = function_data.FunctionName;
  }

  const ref : raw.Reference | undefined = script_findType(dump, function_data.ReturnType.TypeInfo.OldReference);
  function_info.ReturnType = ref ? ref.Value.Name : "void";

  if(function_data.Namespace !== "") {
    function_info.Namespace = function_data.Namespace;
  }

  function_data.ParameterTypes.forEach((type) => {
    const ref : raw.Reference | undefined = script_findType(dump, type.TypeInfo.OldReference);
    
    let typename : string = ref ? ref.Value.Name : "void";

    let param : out.Param = {
      Name : "",
      Type : typename
    };

    if(!function_info.Parameters) {function_info.Parameters = [];}
    function_info.Parameters.push(param);
  });

  let i = 0;
  function_data.ParameterNames.forEach((name) => {
    if(!function_info.Parameters) {function_info.Parameters = [];}
    function_info.Parameters[i].Name = name;
    i++;
  });

  i = 0;
  function_data.ParameterDefaultArgs.forEach((arg) => {
    if(!function_info.Parameters) {function_info.Parameters = [];}
    if(function_info.Parameters[i].Type === "FName") {
      if(arg === "NAME_None") {function_info.Parameters[i].default = "";}
    } if(function_info.Parameters[i].Type === "FString") {
      if(arg === "\"\"") {function_info.Parameters[i].default = "";}
    } else if(arg !== ""){
      function_info.Parameters[i].default = arg;
    }
    i++;
  });

  return function_info;
}

function script_getPropertyInfo(dump : Scriptsdump, property_data : raw.Property, module : string) : out.Variable | undefined {
  let property_info : out.Variable = {
    Module : module,
    Name : property_data.Name,
    Type : ""
  };

  if(property_data.bIsPrivate || property_data.bIsProtected) {
    return undefined;
  }

  let typename : raw.Reference | undefined = script_findType(dump, property_data.Type.TypeInfo.OldReference);

  property_info.Type = typename ? typename.Value.Name : "void";

  return property_info;
}

function script_getVariableInfo(dump : Scriptsdump, var_data : raw.GlobalVariable, module : string) : out.Variable {
  let var_info : out.Variable = {
    Module : module,
    Name : var_data.Name,
    Type : ""
  };

  if(var_data.Namespace !== "") {
    var_info.Namespace = var_data.Namespace;
  }

  let typename : raw.Reference | undefined = script_findType(dump, var_data.Type.TypeInfo.OldReference);

  var_info.Type = typename ? typename.Value.Name : "void";

  return var_info;
}

function script_getEnumInfo(enum_data : raw.Enum, module : string) : out.Enum {
  let enum_info : out.Enum = {
    Module : module,
    Name : enum_data.Name,
    Values : enum_data.EnumNames
  };

  if(enum_data.Namespace !== "") {
    enum_info.Namespace = enum_data.Namespace;
  }

  return enum_info;
}

function script_findType(dump : Scriptsdump, ref : number) : raw.Reference | undefined {
  const val : raw.Reference | undefined = dump.TypeReferences.find((t) => {
    return t.Key === ref;
  });

  return val;
}

function bind_getStructInfo(struct_data: bind.Struct) : out.Type {
   let type_info : out.Type = {
    Name: struct_data.TypeName.replaceAll('\0', '')
  };

  struct_data.Properties.forEach((prop) => {

    const tk : string[] = prop.Declaration.replaceAll('\0', '').split(' ');
    const property_info : out.Variable = {
      Type: tk[tk.length - 2],
      Name: tk[tk.length - 1]
    };
    if(!type_info.Properties) {type_info.Properties = [];}
    type_info.Properties.push(property_info);
  });

  return type_info;
}

function bind_getClassInfo(class_data: bind.Class) : out.Type {
   let type_info : out.Type = {
    Name: class_data.TypeName.replaceAll('\0', '')
  };

  class_data.Properties.forEach((prop) => {
    const tk : string[] = prop.Declaration.replaceAll('\0', '').split(' ');
    const property_info : out.Variable = {
      Type: tk[tk.length - 2],
      Name: tk[tk.length - 1]
    };
    if(!type_info.Properties) {type_info.Properties = [];}
    type_info.Properties.push(property_info);
  });

  class_data.Methods.forEach((method) => {
    const decl : string = method.Declaration.replaceAll('\0', '');
    const paramdef : string = decl.substring(decl.lastIndexOf('(') + 1, decl.lastIndexOf(')'));
    const idef : string = decl.substring(0, decl.lastIndexOf('('));

    const tk : string[] = idef.split(' ');
    const method_info : out.Function = {
      ReturnType: tk[tk.length - 2],
      Name: tk[tk.length - 1]
    };

    if(paramdef !== undefined) {
      const params : string[] = paramdef.split(',');
      params.forEach((p, i) => {
        if(i !== method.WorldContextArgument) {
          const tk2 : string[] = p.split('=');
          const tk : string[] = tk2[0].trim().split(' ');

          const param_info : out.Param = {
            Type: tk[tk.length - 2],
            Name: tk[tk.length - 1],
          };

          if(tk2.length > 1) {
            param_info.default = tk2[1].trim();
          }

          if(!method_info.Parameters) {method_info.Parameters = [];}
          method_info.Parameters.push(param_info);
        }
      });
    }

    if(!type_info.Methods) {type_info.Methods = [];}
    type_info.Methods.push(method_info);

    if(method.bStaticInScript) {
      type_info.Name = "__STATIC_";
      method_info.Namespace = method.ClassName.replaceAll('\0', '');
    }
  });

  return type_info;
}

async function run() {
  const scriptsdump : Scriptsdump = await parse_scripts_dump();
  const bindsdump : Bindsdump = await parse_binds_dump();
  await parse(scriptsdump, bindsdump);
}

run();