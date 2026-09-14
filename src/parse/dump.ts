// To parse this data:
//
//   import { Convert, Dump } from "./dump";
//
//   const dump = Convert.toDump(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Dump {
    BuildIdentifier:              number;
    Modules:                      Module[];
    TypeReferences:               Reference[];
    TypeIdReferenceToPointer:     IDReferenceToPointer[];
    FunctionReferences:           FunctionReference[];
    FunctionIdReferenceToPointer: IDReferenceToPointer[];
    GlobalReferences:             Reference[];
    StaticNames:                  string[];
    PropertyReferences:           PropertyReference[];
}

export interface IDReferenceToPointer {
    Key:   number;
    Value: number;
}

export interface FunctionReference {
    Key:   number;
    Value: FunctionReferenceValue;
}

export interface FunctionReferenceValue {
    Name:            string;
    Module:          string;
    Namespace:       string;
    bIsConst:        boolean;
    bIsImportedDecl: boolean;
    bIsVirtual:      boolean;
    bIsMethod:       boolean;
    ObjectType:      ObjectType;
    ParameterTypes:  Type[];
    ReturnType:      Type;
}

export interface ObjectType {
    OldReference: number;
}

export interface Type {
    bIsReference:       boolean;
    bIsObjectConst:     boolean;
    bIsObjectHandle:    boolean;
    bIsConstHandle:     boolean;
    bIsAuto:            boolean;
    bIfHandleThenConst: boolean;
    TypeInfo:           ObjectType;
    TokenType:          number;
}

export interface Reference {
    Key:   number;
    Value: GlobalReferenceValue;
}

export interface GlobalReferenceValue {
    Name:       string;
    Module:     string;
    Namespace:  Namespace;
    bIsString?: boolean;
    SubTypes?:  Type[];
}

export type Namespace = "" | "FlyingMachineTag" | "FOutlines" | "MinigameVOData" | "GrindSettings" | "ActionNames" | "Sap::Projectile" | "MovementSystemTags" | "BoatsledTags" | "GrappleSettings" | "FMagneticTags" | "ClockworkBullBossTags" | "FlyingMachineAction" | "SnowballFightAction" | "FVector" | "EKeys" | "FeatureName" | "HazeAudio::RTPC" | "CameraTags" | "HazeAudio::SWITCH" | "WindWalkTags" | "FLinearColor" | "BeanstalkTags" | "GroundPoundTags" | "CapabilityTags" | "FRotator" | "Sap" | "FQuat" | "RailCart::Speed" | "ChargerSettings" | "CurlingTags" | "LarvaBasket" | "GroundPoundEventActivation" | "ComponentTags" | "PickupTags" | "HazeAudio::STATES" | "GardenSickle" | "SwimmingTags" | "IceSkatingTags" | "PowerfulSongTags" | "GroundPoundSettings" | "FColor" | "TomatoTags" | "GrindingNetworkNames" | "MeleeTags" | "LedgeGrabActivationEvents" | "GrindingCapabilityTags" | "LedgeGrabTags" | "Sap::Batch" | "PlungerGun" | "AttributeNames" | "BlockExclusionTags" | "Sap::Explode" | "FlyingMachineCategory" | "Sap::Pressure" | "GrindingActivationEvents" | "Firefly" | "SwimmingSettings" | "AttributeVectorNames" | "FHazeCameraBlendSettings" | "FVector2D" | "Hazeboy" | "BoatsledVOStrings" | "FTransform" | "WallSlideAnimParams" | "GrindInteractSyncNames" | "TurretPlantTags" | "FMarbleTags" | "PhysicalMaterialAudio" | "ClockworkBirdTags" | "JumpingFrogTags" | "RailCartTags" | "SnowGlobeSwimmingTags" | "TrapezeTags" | "HazeAudio::DEFAULTEVENTS" | "WallSlideSyncing" | "SneakyBushTags" | "DandelionTags" | "TimeControlCapabilityTags" | "GardenAudioActions" | "AudioTags" | "ButtonMashTags" | "GrindInteractAnim" | "LedgeGrabSyncNames" | "FlyingMachineAttribute" | "MoleStealthSettings" | "CastleMusicIntensity" | "MovementActivationEvents" | "SlidingActivationEvents" | "AnimationFloats" | "CymbalTags" | "WallslideActivationEvents" | "LedgeVaultSyncTags" | "Sap::Aim" | "Sap::Shooting" | "DashTags" | "LedgeNodeSyncTags" | "FCameraTags" | "GroundPoundSyncNames" | "SplineSlideTags" | "SapWeaponTags" | "MinigameCapabilityTags" | "FollowCloudAvoidance" | "ClockworkBullBossAnimationTags" | "Smooch" | "WallSlideActions" | "LedgeNodeTags" | "SlotCarSettings" | "SnowballFightAttribute" | "WallSlideTags" | "SocketNames" | "SnowballFightTags" | "Wasp" | "Sap::Stream" | "LedgeGrabAnimationParams" | "HockeyPuckTags" | "HazeAudio::StaticValues" | "ValveTurnTags" | "ExampleAttribueNamespace" | "LedgeVaultAnimParams" | "SlidingTags" | "ExampleActionsNamespace" | "LedgeNodeActions" | "SnowFolkAction" | "FPointOfInterestStatics" | "HazeAudio";

export interface Module {
    Key:   string;
    Value: ModuleValue;
}

export interface ModuleValue {
    ModuleName:             string;
    Functions:              Function[];
    Classes:                Class[];
    Enums:                  Enum[];
    GlobalVariables:        GlobalVariable[];
    FunctionImports:        FunctionImport[];
    CodeHash:               number;
    ImportedModules:        string[];
    StaticsClassName:       string;
    DeclaredEvents:         string[];
    DeclaredDelegates:      string[];
    ScriptRelativeFilename: string;
}

export interface Class {
    ClassName:                      string;
    Namespace:                      Namespace;
    Alignment:                      number;
    Flags:                          number;
    Properties:                     Property[];
    Methods:                        Function[];
    MethodTable:                    number[];
    DerivedFrom:                    ObjectType;
    ShadowType:                     ObjectType;
    Constructors:                   InitFunc[];
    Factories:                      InitFunc[];
    BehaviorRefs:                   ObjectType[];
    BehaviorFunctions:              InitFunc[];
    BehaviorFunctionTypes:          number[];
    bIsInPreprocessor:              boolean;
    SuperClass?:                    string;
    CodeSuperClass?:                string;
    bSuperIsCodeClass?:             boolean;
    bAbstract?:                     boolean;
    bIsDeprecatedClass?:            boolean;
    ConfigName?:                    ConfigName;
    StaticClassGlobalVariableName?: string;
    bPlaceable?:                    boolean;
    MetaSpec?:                      string[];
    MetaValues?:                    string[];
    ComposeOntoClassModule?:        string;
    ComposeOntoClassName?:          string;
}

export interface InitFunc {
    FunctionName:           string;
    Namespace:              Namespace;
    ReturnType:             Type;
    ParameterTypes:         Type[];
    ParameterNames:         string[];
    ParameterFlags:         number[];
    ParameterDefaultArgs:   string[];
    FunctionTraits:         number;
    ByteCode:               number[];
    ByteCodeReferences:     unknown[];
    VariableSpace:          number;
    ObjVariableTypes:       ObjectType[];
    ObjVariablePos:         number[];
    ObjVariablesOnHeap:     number;
    VariableInfoProgramPos: number[];
    VariableInfoOffset:     number[];
    VariableInfoOption:     number[];
    StackNeeded:            number;
    Guid:                   GUID;
    DeclaredAt:             number;
    LineNumbers:            unknown[];
    bIsUFunction:           boolean;
}

export interface GUID {
    A: number;
    B: number;
    C: number;
    D: number;
}

export type ConfigName = "" | "Editor";

export interface Function {
    FunctionName:             string;
    Namespace:                string;
    ReturnType:               Type;
    ParameterTypes:           Type[];
    ParameterNames:           string[];
    ParameterFlags:           number[];
    ParameterDefaultArgs:     string[];
    FunctionTraits:           number;
    ByteCode:                 number[];
    ByteCodeReferences:       unknown[];
    VariableSpace:            number;
    ObjVariableTypes:         ObjectType[];
    ObjVariablePos:           number[];
    ObjVariablesOnHeap:       number;
    VariableInfoProgramPos:   number[];
    VariableInfoOffset:       number[];
    VariableInfoOption:       number[];
    StackNeeded:              number;
    Guid:                     GUID;
    DeclaredAt:               number;
    LineNumbers:              unknown[];
    bIsUFunction:             boolean;
    UnrealFunctionName?:      string;
    MetaSpec?:                FunctionMetaSpec[];
    MetaValues?:              string[];
    bBlueprintCallable?:      boolean;
    bBlueprintOverride?:      boolean;
    bBlueprintEvent?:         boolean;
    bBlueprintPure?:          boolean;
    bNetFunction?:            boolean;
    bNetMulticast?:           boolean;
    bNetClient?:              boolean;
    bNetServer?:              boolean;
    bNetValidate?:            boolean;
    bUnreliable?:             boolean;
    bBlueprintAuthorityOnly?: boolean;
    bCanOverrideEvent?:       boolean;
    bDevFunction?:            boolean;
    bIsStatic?:               boolean;
    bIsConstMethod?:          boolean;
    bThreadSafe?:             boolean;
    bIsNoOp?:                 boolean;
}

export type FunctionMetaSpec = "DevelopmentOnly" | "DisplayName" | "Category" | "ReturnDisplayName" | "AutoCreateBPNode" | "CallInEditor" | "BlueprintThreadSafe" | "DeprecatedFunction" | "Deprecated" | "AdvancedDisplay" | "DeprecationMessage" | "BlueprintInternalUseOnly" | "Keywords" | "CompactNodeTitle" | "UseExecPins" | "AutoSplit" | "ExpandToEnum" | "ExpandedEnum" | "HidePin" | "DefaultToSelf";

export interface Property {
    Name:                 string;
    Type:                 Type;
    bIsPrivate:           boolean;
    bIsProtected:         boolean;
    bIsUnrealProperty:    boolean;
    MetaSpec?:            PropertyMetaSpec[];
    MetaValues?:          string[];
    bBlueprintReadable?:  boolean;
    bBlueprintWritable?:  boolean;
    bEditConst?:          boolean;
    bEditableOnDefaults?: boolean;
    bEditableOnInstance?: boolean;
    bInstancedReference?: boolean;
    bAdvancedDisplay?:    boolean;
    bTransient?:          boolean;
    bReplicated?:         boolean;
    bSkipReplication?:    boolean;
    bConfig?:             boolean;
    bInterp?:             boolean;
}

export type PropertyMetaSpec = "Category" | "NotBlueprintCallable" | "EditInlineDefaults" | "DefaultComponent" | "RootComponent" | "EditCondition" | "EditConditionHides" | "Attach" | "InlineEditConditionToggle" | "ClampMin" | "ClampMax" | "UIMin" | "UIMax" | "MakeEditWidget" | "AttachSocket" | "EditInline" | "ShowOnlyInnerProperties" | "BindWidget" | "EditFixedSize" | "BPCannotCallEvent" | "EditValue" | "DisplayName" | "EditConditionHides))" | "Multiline" | "BlueprintSetter" | "ComposedStruct" | "ExposeOnSpawn" | "AllowAbstract" | "EditConditionHides)";

export interface Enum {
    Name:       string;
    Namespace:  Namespace;
    EnumNames:  string[];
    EnumValues: number[];
}

export interface FunctionImport {
    ImportedFromModule: string;
    Signature:          Signature;
}

export interface Signature {
    Name:                 string;
    Namespace:            string;
    ParameterTypes:       Type[];
    ParameterFlags:       number[];
    ParameterDefaultArgs: string[];
    ReturnType:           Type;
}

export interface GlobalVariable {
    Name:             string;
    Namespace:        Namespace;
    Type:             Type;
    bHasInitFunction: boolean;
    InitFunc:         InitFunc;
}

export interface PropertyReference {
    Key:   number;
    Value: PropertyReferenceValue;
}

export interface PropertyReferenceValue {
    Name:      string;
    OldTypeId: number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toDump(json: string): Dump {
        return cast(JSON.parse(json), r("Dump"));
    }

    public static dumpToJson(value: Dump): string {
        return JSON.stringify(uncast(value, r("Dump")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Dump": o([
        { json: "BuildIdentifier", js: "BuildIdentifier", typ: 0 },
        { json: "Modules", js: "Modules", typ: a(r("Module")) },
        { json: "TypeReferences", js: "TypeReferences", typ: a(r("Reference")) },
        { json: "TypeIdReferenceToPointer", js: "TypeIdReferenceToPointer", typ: a(r("IDReferenceToPointer")) },
        { json: "FunctionReferences", js: "FunctionReferences", typ: a(r("FunctionReference")) },
        { json: "FunctionIdReferenceToPointer", js: "FunctionIdReferenceToPointer", typ: a(r("IDReferenceToPointer")) },
        { json: "GlobalReferences", js: "GlobalReferences", typ: a(r("Reference")) },
        { json: "StaticNames", js: "StaticNames", typ: a("") },
        { json: "PropertyReferences", js: "PropertyReferences", typ: a(r("PropertyReference")) },
    ], false),
    "IDReferenceToPointer": o([
        { json: "Key", js: "Key", typ: 0 },
        { json: "Value", js: "Value", typ: 0 },
    ], false),
    "FunctionReference": o([
        { json: "Key", js: "Key", typ: 0 },
        { json: "Value", js: "Value", typ: r("FunctionReferenceValue") },
    ], false),
    "FunctionReferenceValue": o([
        { json: "Name", js: "Name", typ: "" },
        { json: "Module", js: "Module", typ: "" },
        { json: "Namespace", js: "Namespace", typ: "" },
        { json: "bIsConst", js: "bIsConst", typ: true },
        { json: "bIsImportedDecl", js: "bIsImportedDecl", typ: true },
        { json: "bIsVirtual", js: "bIsVirtual", typ: true },
        { json: "bIsMethod", js: "bIsMethod", typ: true },
        { json: "ObjectType", js: "ObjectType", typ: r("ObjectType") },
        { json: "ParameterTypes", js: "ParameterTypes", typ: a(r("Type")) },
        { json: "ReturnType", js: "ReturnType", typ: r("Type") },
    ], false),
    "ObjectType": o([
        { json: "OldReference", js: "OldReference", typ: 0 },
    ], false),
    "Type": o([
        { json: "bIsReference", js: "bIsReference", typ: true },
        { json: "bIsObjectConst", js: "bIsObjectConst", typ: true },
        { json: "bIsObjectHandle", js: "bIsObjectHandle", typ: true },
        { json: "bIsConstHandle", js: "bIsConstHandle", typ: true },
        { json: "bIsAuto", js: "bIsAuto", typ: true },
        { json: "bIfHandleThenConst", js: "bIfHandleThenConst", typ: true },
        { json: "TypeInfo", js: "TypeInfo", typ: r("ObjectType") },
        { json: "TokenType", js: "TokenType", typ: 0 },
    ], false),
    "Reference": o([
        { json: "Key", js: "Key", typ: 0 },
        { json: "Value", js: "Value", typ: r("GlobalReferenceValue") },
    ], false),
    "GlobalReferenceValue": o([
        { json: "Name", js: "Name", typ: "" },
        { json: "Module", js: "Module", typ: "" },
        { json: "Namespace", js: "Namespace", typ: r("Namespace") },
        { json: "bIsString", js: "bIsString", typ: u(undefined, true) },
        { json: "SubTypes", js: "SubTypes", typ: u(undefined, a(r("Type"))) },
    ], false),
    "Module": o([
        { json: "Key", js: "Key", typ: "" },
        { json: "Value", js: "Value", typ: r("ModuleValue") },
    ], false),
    "ModuleValue": o([
        { json: "ModuleName", js: "ModuleName", typ: "" },
        { json: "Functions", js: "Functions", typ: a(r("Function")) },
        { json: "Classes", js: "Classes", typ: a(r("Class")) },
        { json: "Enums", js: "Enums", typ: a(r("Enum")) },
        { json: "GlobalVariables", js: "GlobalVariables", typ: a(r("GlobalVariable")) },
        { json: "FunctionImports", js: "FunctionImports", typ: a(r("FunctionImport")) },
        { json: "CodeHash", js: "CodeHash", typ: 3.14 },
        { json: "ImportedModules", js: "ImportedModules", typ: a("") },
        { json: "StaticsClassName", js: "StaticsClassName", typ: "" },
        { json: "DeclaredEvents", js: "DeclaredEvents", typ: a("") },
        { json: "DeclaredDelegates", js: "DeclaredDelegates", typ: a("") },
        { json: "ScriptRelativeFilename", js: "ScriptRelativeFilename", typ: "" },
    ], false),
    "Class": o([
        { json: "ClassName", js: "ClassName", typ: "" },
        { json: "Namespace", js: "Namespace", typ: r("Namespace") },
        { json: "Alignment", js: "Alignment", typ: 0 },
        { json: "Flags", js: "Flags", typ: 0 },
        { json: "Properties", js: "Properties", typ: a(r("Property")) },
        { json: "Methods", js: "Methods", typ: a(r("Function")) },
        { json: "MethodTable", js: "MethodTable", typ: a(0) },
        { json: "DerivedFrom", js: "DerivedFrom", typ: r("ObjectType") },
        { json: "ShadowType", js: "ShadowType", typ: r("ObjectType") },
        { json: "Constructors", js: "Constructors", typ: a(r("InitFunc")) },
        { json: "Factories", js: "Factories", typ: a(r("InitFunc")) },
        { json: "BehaviorRefs", js: "BehaviorRefs", typ: a(r("ObjectType")) },
        { json: "BehaviorFunctions", js: "BehaviorFunctions", typ: a(r("InitFunc")) },
        { json: "BehaviorFunctionTypes", js: "BehaviorFunctionTypes", typ: a(0) },
        { json: "bIsInPreprocessor", js: "bIsInPreprocessor", typ: true },
        { json: "SuperClass", js: "SuperClass", typ: u(undefined, "") },
        { json: "CodeSuperClass", js: "CodeSuperClass", typ: u(undefined, "") },
        { json: "bSuperIsCodeClass", js: "bSuperIsCodeClass", typ: u(undefined, true) },
        { json: "bAbstract", js: "bAbstract", typ: u(undefined, true) },
        { json: "bIsDeprecatedClass", js: "bIsDeprecatedClass", typ: u(undefined, true) },
        { json: "ConfigName", js: "ConfigName", typ: u(undefined, r("ConfigName")) },
        { json: "StaticClassGlobalVariableName", js: "StaticClassGlobalVariableName", typ: u(undefined, "") },
        { json: "bPlaceable", js: "bPlaceable", typ: u(undefined, true) },
        { json: "MetaSpec", js: "MetaSpec", typ: u(undefined, a("")) },
        { json: "MetaValues", js: "MetaValues", typ: u(undefined, a("")) },
        { json: "ComposeOntoClassModule", js: "ComposeOntoClassModule", typ: u(undefined, "") },
        { json: "ComposeOntoClassName", js: "ComposeOntoClassName", typ: u(undefined, "") },
    ], false),
    "InitFunc": o([
        { json: "FunctionName", js: "FunctionName", typ: "" },
        { json: "Namespace", js: "Namespace", typ: r("Namespace") },
        { json: "ReturnType", js: "ReturnType", typ: r("Type") },
        { json: "ParameterTypes", js: "ParameterTypes", typ: a(r("Type")) },
        { json: "ParameterNames", js: "ParameterNames", typ: a("") },
        { json: "ParameterFlags", js: "ParameterFlags", typ: a(0) },
        { json: "ParameterDefaultArgs", js: "ParameterDefaultArgs", typ: a("") },
        { json: "FunctionTraits", js: "FunctionTraits", typ: 0 },
        { json: "ByteCode", js: "ByteCode", typ: a(0) },
        { json: "ByteCodeReferences", js: "ByteCodeReferences", typ: a("any") },
        { json: "VariableSpace", js: "VariableSpace", typ: 0 },
        { json: "ObjVariableTypes", js: "ObjVariableTypes", typ: a(r("ObjectType")) },
        { json: "ObjVariablePos", js: "ObjVariablePos", typ: a(0) },
        { json: "ObjVariablesOnHeap", js: "ObjVariablesOnHeap", typ: 0 },
        { json: "VariableInfoProgramPos", js: "VariableInfoProgramPos", typ: a(0) },
        { json: "VariableInfoOffset", js: "VariableInfoOffset", typ: a(0) },
        { json: "VariableInfoOption", js: "VariableInfoOption", typ: a(0) },
        { json: "StackNeeded", js: "StackNeeded", typ: 0 },
        { json: "Guid", js: "Guid", typ: r("GUID") },
        { json: "DeclaredAt", js: "DeclaredAt", typ: 0 },
        { json: "LineNumbers", js: "LineNumbers", typ: a("any") },
        { json: "bIsUFunction", js: "bIsUFunction", typ: true },
    ], false),
    "GUID": o([
        { json: "A", js: "A", typ: 0 },
        { json: "B", js: "B", typ: 0 },
        { json: "C", js: "C", typ: 0 },
        { json: "D", js: "D", typ: 0 },
    ], false),
    "Function": o([
        { json: "FunctionName", js: "FunctionName", typ: "" },
        { json: "Namespace", js: "Namespace", typ: "" },
        { json: "ReturnType", js: "ReturnType", typ: r("Type") },
        { json: "ParameterTypes", js: "ParameterTypes", typ: a(r("Type")) },
        { json: "ParameterNames", js: "ParameterNames", typ: a("") },
        { json: "ParameterFlags", js: "ParameterFlags", typ: a(0) },
        { json: "ParameterDefaultArgs", js: "ParameterDefaultArgs", typ: a("") },
        { json: "FunctionTraits", js: "FunctionTraits", typ: 0 },
        { json: "ByteCode", js: "ByteCode", typ: a(0) },
        { json: "ByteCodeReferences", js: "ByteCodeReferences", typ: a("any") },
        { json: "VariableSpace", js: "VariableSpace", typ: 0 },
        { json: "ObjVariableTypes", js: "ObjVariableTypes", typ: a(r("ObjectType")) },
        { json: "ObjVariablePos", js: "ObjVariablePos", typ: a(0) },
        { json: "ObjVariablesOnHeap", js: "ObjVariablesOnHeap", typ: 0 },
        { json: "VariableInfoProgramPos", js: "VariableInfoProgramPos", typ: a(0) },
        { json: "VariableInfoOffset", js: "VariableInfoOffset", typ: a(0) },
        { json: "VariableInfoOption", js: "VariableInfoOption", typ: a(0) },
        { json: "StackNeeded", js: "StackNeeded", typ: 0 },
        { json: "Guid", js: "Guid", typ: r("GUID") },
        { json: "DeclaredAt", js: "DeclaredAt", typ: 0 },
        { json: "LineNumbers", js: "LineNumbers", typ: a("any") },
        { json: "bIsUFunction", js: "bIsUFunction", typ: true },
        { json: "UnrealFunctionName", js: "UnrealFunctionName", typ: u(undefined, "") },
        { json: "MetaSpec", js: "MetaSpec", typ: u(undefined, a(r("FunctionMetaSpec"))) },
        { json: "MetaValues", js: "MetaValues", typ: u(undefined, a("")) },
        { json: "bBlueprintCallable", js: "bBlueprintCallable", typ: u(undefined, true) },
        { json: "bBlueprintOverride", js: "bBlueprintOverride", typ: u(undefined, true) },
        { json: "bBlueprintEvent", js: "bBlueprintEvent", typ: u(undefined, true) },
        { json: "bBlueprintPure", js: "bBlueprintPure", typ: u(undefined, true) },
        { json: "bNetFunction", js: "bNetFunction", typ: u(undefined, true) },
        { json: "bNetMulticast", js: "bNetMulticast", typ: u(undefined, true) },
        { json: "bNetClient", js: "bNetClient", typ: u(undefined, true) },
        { json: "bNetServer", js: "bNetServer", typ: u(undefined, true) },
        { json: "bNetValidate", js: "bNetValidate", typ: u(undefined, true) },
        { json: "bUnreliable", js: "bUnreliable", typ: u(undefined, true) },
        { json: "bBlueprintAuthorityOnly", js: "bBlueprintAuthorityOnly", typ: u(undefined, true) },
        { json: "bCanOverrideEvent", js: "bCanOverrideEvent", typ: u(undefined, true) },
        { json: "bDevFunction", js: "bDevFunction", typ: u(undefined, true) },
        { json: "bIsStatic", js: "bIsStatic", typ: u(undefined, true) },
        { json: "bIsConstMethod", js: "bIsConstMethod", typ: u(undefined, true) },
        { json: "bThreadSafe", js: "bThreadSafe", typ: u(undefined, true) },
        { json: "bIsNoOp", js: "bIsNoOp", typ: u(undefined, true) },
    ], false),
    "Property": o([
        { json: "Name", js: "Name", typ: "" },
        { json: "Type", js: "Type", typ: r("Type") },
        { json: "bIsPrivate", js: "bIsPrivate", typ: true },
        { json: "bIsProtected", js: "bIsProtected", typ: true },
        { json: "bIsUnrealProperty", js: "bIsUnrealProperty", typ: true },
        { json: "MetaSpec", js: "MetaSpec", typ: u(undefined, a(r("PropertyMetaSpec"))) },
        { json: "MetaValues", js: "MetaValues", typ: u(undefined, a("")) },
        { json: "bBlueprintReadable", js: "bBlueprintReadable", typ: u(undefined, true) },
        { json: "bBlueprintWritable", js: "bBlueprintWritable", typ: u(undefined, true) },
        { json: "bEditConst", js: "bEditConst", typ: u(undefined, true) },
        { json: "bEditableOnDefaults", js: "bEditableOnDefaults", typ: u(undefined, true) },
        { json: "bEditableOnInstance", js: "bEditableOnInstance", typ: u(undefined, true) },
        { json: "bInstancedReference", js: "bInstancedReference", typ: u(undefined, true) },
        { json: "bAdvancedDisplay", js: "bAdvancedDisplay", typ: u(undefined, true) },
        { json: "bTransient", js: "bTransient", typ: u(undefined, true) },
        { json: "bReplicated", js: "bReplicated", typ: u(undefined, true) },
        { json: "bSkipReplication", js: "bSkipReplication", typ: u(undefined, true) },
        { json: "bConfig", js: "bConfig", typ: u(undefined, true) },
        { json: "bInterp", js: "bInterp", typ: u(undefined, true) },
    ], false),
    "Enum": o([
        { json: "Name", js: "Name", typ: "" },
        { json: "Namespace", js: "Namespace", typ: r("Namespace") },
        { json: "EnumNames", js: "EnumNames", typ: a("") },
        { json: "EnumValues", js: "EnumValues", typ: a(0) },
    ], false),
    "FunctionImport": o([
        { json: "ImportedFromModule", js: "ImportedFromModule", typ: "" },
        { json: "Signature", js: "Signature", typ: r("Signature") },
    ], false),
    "Signature": o([
        { json: "Name", js: "Name", typ: "" },
        { json: "Namespace", js: "Namespace", typ: "" },
        { json: "ParameterTypes", js: "ParameterTypes", typ: a(r("Type")) },
        { json: "ParameterFlags", js: "ParameterFlags", typ: a(0) },
        { json: "ParameterDefaultArgs", js: "ParameterDefaultArgs", typ: a("") },
        { json: "ReturnType", js: "ReturnType", typ: r("Type") },
    ], false),
    "GlobalVariable": o([
        { json: "Name", js: "Name", typ: "" },
        { json: "Namespace", js: "Namespace", typ: r("Namespace") },
        { json: "Type", js: "Type", typ: r("Type") },
        { json: "bHasInitFunction", js: "bHasInitFunction", typ: true },
        { json: "InitFunc", js: "InitFunc", typ: r("InitFunc") },
    ], false),
    "PropertyReference": o([
        { json: "Key", js: "Key", typ: 0 },
        { json: "Value", js: "Value", typ: r("PropertyReferenceValue") },
    ], false),
    "PropertyReferenceValue": o([
        { json: "Name", js: "Name", typ: "" },
        { json: "OldTypeId", js: "OldTypeId", typ: 0 },
    ], false),
    "Namespace": [
        "ActionNames",
        "AnimationFloats",
        "AttributeNames",
        "AttributeVectorNames",
        "AudioTags",
        "BeanstalkTags",
        "BlockExclusionTags",
        "BoatsledTags",
        "BoatsledVOStrings",
        "ButtonMashTags",
        "CameraTags",
        "CapabilityTags",
        "CastleMusicIntensity",
        "ChargerSettings",
        "ClockworkBirdTags",
        "ClockworkBullBossAnimationTags",
        "ClockworkBullBossTags",
        "ComponentTags",
        "CurlingTags",
        "CymbalTags",
        "DandelionTags",
        "DashTags",
        "EKeys",
        "",
        "ExampleActionsNamespace",
        "ExampleAttribueNamespace",
        "FCameraTags",
        "FColor",
        "FHazeCameraBlendSettings",
        "FLinearColor",
        "FMagneticTags",
        "FMarbleTags",
        "FOutlines",
        "FPointOfInterestStatics",
        "FQuat",
        "FRotator",
        "FTransform",
        "FVector",
        "FVector2D",
        "FeatureName",
        "Firefly",
        "FlyingMachineAction",
        "FlyingMachineAttribute",
        "FlyingMachineCategory",
        "FlyingMachineTag",
        "FollowCloudAvoidance",
        "GardenAudioActions",
        "GardenSickle",
        "GrappleSettings",
        "GrindInteractAnim",
        "GrindInteractSyncNames",
        "GrindSettings",
        "GrindingActivationEvents",
        "GrindingCapabilityTags",
        "GrindingNetworkNames",
        "GroundPoundEventActivation",
        "GroundPoundSettings",
        "GroundPoundSyncNames",
        "GroundPoundTags",
        "HazeAudio",
        "HazeAudio::DEFAULTEVENTS",
        "HazeAudio::RTPC",
        "HazeAudio::STATES",
        "HazeAudio::SWITCH",
        "HazeAudio::StaticValues",
        "Hazeboy",
        "HockeyPuckTags",
        "IceSkatingTags",
        "JumpingFrogTags",
        "LarvaBasket",
        "LedgeGrabActivationEvents",
        "LedgeGrabAnimationParams",
        "LedgeGrabSyncNames",
        "LedgeGrabTags",
        "LedgeNodeActions",
        "LedgeNodeSyncTags",
        "LedgeNodeTags",
        "LedgeVaultAnimParams",
        "LedgeVaultSyncTags",
        "MeleeTags",
        "MinigameCapabilityTags",
        "MinigameVOData",
        "MoleStealthSettings",
        "MovementActivationEvents",
        "MovementSystemTags",
        "PhysicalMaterialAudio",
        "PickupTags",
        "PlungerGun",
        "PowerfulSongTags",
        "RailCart::Speed",
        "RailCartTags",
        "Sap",
        "Sap::Aim",
        "Sap::Batch",
        "Sap::Explode",
        "Sap::Pressure",
        "Sap::Projectile",
        "Sap::Shooting",
        "Sap::Stream",
        "SapWeaponTags",
        "SlidingActivationEvents",
        "SlidingTags",
        "SlotCarSettings",
        "Smooch",
        "SneakyBushTags",
        "SnowFolkAction",
        "SnowGlobeSwimmingTags",
        "SnowballFightAction",
        "SnowballFightAttribute",
        "SnowballFightTags",
        "SocketNames",
        "SplineSlideTags",
        "SwimmingSettings",
        "SwimmingTags",
        "TimeControlCapabilityTags",
        "TomatoTags",
        "TrapezeTags",
        "TurretPlantTags",
        "ValveTurnTags",
        "WallSlideActions",
        "WallSlideAnimParams",
        "WallSlideSyncing",
        "WallSlideTags",
        "WallslideActivationEvents",
        "Wasp",
        "WindWalkTags",
    ],
    "ConfigName": [
        "Editor",
        "",
    ],
    "FunctionMetaSpec": [
        "AdvancedDisplay",
        "AutoCreateBPNode",
        "AutoSplit",
        "BlueprintInternalUseOnly",
        "BlueprintThreadSafe",
        "CallInEditor",
        "Category",
        "CompactNodeTitle",
        "DefaultToSelf",
        "Deprecated",
        "DeprecatedFunction",
        "DeprecationMessage",
        "DevelopmentOnly",
        "DisplayName",
        "ExpandToEnum",
        "ExpandedEnum",
        "HidePin",
        "Keywords",
        "ReturnDisplayName",
        "UseExecPins",
    ],
    "PropertyMetaSpec": [
        "AllowAbstract",
        "Attach",
        "AttachSocket",
        "BPCannotCallEvent",
        "BindWidget",
        "BlueprintSetter",
        "Category",
        "ClampMax",
        "ClampMin",
        "ComposedStruct",
        "DefaultComponent",
        "DisplayName",
        "EditCondition",
        "EditConditionHides",
        "EditFixedSize",
        "EditInline",
        "EditInlineDefaults",
        "EditValue",
        "ExposeOnSpawn",
        "InlineEditConditionToggle",
        "MakeEditWidget",
        "EditConditionHides))",
        "Multiline",
        "NotBlueprintCallable",
        "EditConditionHides)",
        "RootComponent",
        "ShowOnlyInnerProperties",
        "UIMax",
        "UIMin",
    ],
};
