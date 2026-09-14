export interface as_info {
  Type: Type[];
  Enum: Enum[];
  Function: Function[];
  Variable: Variable[];
}

export interface Type {
  Module?: string;
  Namespace?: string;
  Name: string;
  Constructors?: Function[];
  Methods?: Function[];
  Properties?: Variable[];
}

export interface Enum {
  Module?: string;
  Namespace? : string;
  Name: string;
  Values: string[];
}

export interface Function {
  Module?: string;
  Namespace?: string;
  Name: string;
  ReturnType: string;
  Parameters?: Param[];
}

export interface Param {
  Name: string;
  Type: string;
  default?: string;
}

export interface Variable {
  Module?: string;
  Namespace?: string;
  Name: string;
  Type: string;
}