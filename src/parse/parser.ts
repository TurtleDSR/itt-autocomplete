import * as syncfs from 'fs';
import { promises as fs } from 'fs';
import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { streamObject } from 'stream-json/streamers/stream-object.js';
import { Dump } from './dump.ts';
import * as raw from './dump.ts';
import * as out from './interface.ts';

async function parse_dump() : Promise<Dump> {
  const pipeline = chain([
    syncfs.createReadStream("dump/dump.json"),
    parser(),
    streamObject.streamObject(),
  ]);

  const result: Partial<Dump> = {};

  return new Promise((reslove, reject) => {
    pipeline.on('data', ({key, value}: {key: string; value: unknown}) => {
      (result as Record<string, unknown>)[key] = value;
    });

    pipeline.on('end', () => reslove(result as Dump));
    pipeline.on('error', (err) => reject(err));
  });
}

async function parse(dump : Dump) {
  let info : out.as_info = {
    Type : [],
    Enum : [],
    Function : [],
    Variable : [],
  };

  dump.Modules.forEach((module) => {
    const module_name : string = module.Value.ModuleName;

    //functions
    module.Value.Functions.forEach((function_data) => {
      info.Function.push(getFunctionInfo(dump, function_data, module_name));
    });

    //classes
    module.Value.Classes.forEach((type_data) => {
      info.Type.push(getTypeInfo(dump, type_data, module_name));
    });

    //enums
    module.Value.Enums.forEach((enum_data) => {
      info.Enum.push(getEnumData(enum_data, module_name));
    });

    //properties
    module.Value.GlobalVariables.forEach((var_data) => {
      info.Variable.push(getVariableData(dump, var_data, module_name));
    });
  });

  await fs.writeFile("compiled_dump/as_info.json", JSON.stringify(info, null, 2));
}

function getTypeInfo(dump : Dump, type_data : raw.Class, module: string) : out.Type {
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
    type_info.Methods.push(getFunctionInfo(dump, function_data, module));
  });

  //get constructors
  type_data.Factories.forEach((factory) => {
    if(!type_info.Constructors) {type_info.Constructors = [];}
    type_info.Constructors.push(getFunctionInfo(dump, factory, module));
  });

  //get properties
  type_data.Properties.forEach((property) => {
    const prop : out.Variable | undefined = getPropertyData(dump, property, module);
    if(!type_info.Properties) {type_info.Properties = [];}
    if(prop) {type_info.Properties.push(prop);}
  });

  return type_info;
}

function getFunctionInfo(dump : Dump, function_data : raw.Function, module : string) : out.Function {
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

  const ref : raw.Reference | undefined = findType(dump, function_data.ReturnType.TypeInfo.OldReference);
  function_info.ReturnType = ref ? ref.Value.Name : "void";

  if(function_data.Namespace !== "") {
    function_info.Namespace = function_data.Namespace;
  }

  function_data.ParameterTypes.forEach((type) => {
    const ref : raw.Reference | undefined = findType(dump, type.TypeInfo.OldReference);
    
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

function getPropertyData(dump : Dump, property_data : raw.Property, module : string) : out.Variable | undefined {
  let property_info : out.Variable = {
    Module : module,
    Name : property_data.Name,
    Type : ""
  };

  if(property_data.bIsPrivate || property_data.bIsProtected) {
    return undefined;
  }

  let typename : raw.Reference | undefined = findType(dump, property_data.Type.TypeInfo.OldReference);

  property_info.Type = typename ? typename.Value.Name : "void";

  return property_info;
}

function getVariableData(dump : Dump, var_data : raw.GlobalVariable, module : string) : out.Variable {
  let var_info : out.Variable = {
    Module : module,
    Name : var_data.Name,
    Type : ""
  };

  if(var_data.Namespace !== "") {
    var_info.Namespace = var_data.Namespace;
  }

  let typename : raw.Reference | undefined = findType(dump, var_data.Type.TypeInfo.OldReference);

  var_info.Type = typename ? typename.Value.Name : "void";

  return var_info;
}

function getEnumData(enum_data : raw.Enum, module : string) : out.Enum {
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

function findType(dump : Dump, ref : number) : raw.Reference | undefined {
  const val : raw.Reference | undefined = dump.TypeReferences.find((t) => {
    return t.Key === ref;
  });

  return val;
}

async function run() {
  const dump : Dump = await parse_dump();
  await parse(dump);
}

run();