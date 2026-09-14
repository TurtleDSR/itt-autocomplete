import Database from 'better-sqlite3';

import * as syncfs from 'fs';
import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { streamObject } from 'stream-json/streamers/stream-object.js';

import { as_info, Type, Enum, Function, Variable, Param } from './interface';

const db = new Database('data/symbols.db');

function run() {
  parse_info().then((info) => {

    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = OFF');

    db.exec(`
      CREATE TABLE IF NOT EXISTS types (
        name TEXT PRIMARY KEY,
        namespace TEXT,
        module TEXT,
        constructors TEXT,
        methods TEXT,
        properties TEXT
      );

      CREATE TABLE IF NOT EXISTS enums (
        name TEXT PRIMARY KEY,
        namespace TEXT,
        module TEXT,
        enum_values TEXT
      );

      CREATE TABLE IF NOT EXISTS functions (
        name TEXT NOT NULL,
        namespace TEXT,
        module TEXT,
        return_type TEXT,
        params TEXT
      );

      CREATE TABLE IF NOT EXISTS variables (
        name TEXT NOT NULL,
        namespace TEXT,
        module TEXT,
        type TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_types_ns ON types(namespace);
      CREATE INDEX IF NOT EXISTS idx_enums_ns ON enums(namespace);
      CREATE INDEX IF NOT EXISTS idx_funcs_name ON functions(name);
      CREATE INDEX IF NOT EXISTS idx_funcs_ns ON functions(namespace);
      CREATE INDEX IF NOT EXISTS idx_vars_name ON variables(name);
      CREATE INDEX IF NOT EXISTS idx_vars_ns ON variables(namespace);
    `);

    const insertType = db.prepare(`
      INSERT INTO types (name, namespace, module, constructors, methods, properties)
      VALUES (@name, @namespace, @module, @constructors, @methods, @properties)
    `);

    const insertEnum = db.prepare(`
      INSERT INTO enums (name, namespace, module, enum_values)
      VALUES (@name, @namespace, @module, @enum_values)
    `);

    const insertFunction = db.prepare(`
      INSERT INTO functions (name, namespace, module, return_type, params)
      VALUES (@name, @namespace, @module, @return_type, @params)
    `);

    const insertVar = db.prepare(`
      INSERT INTO variables (name, namespace, module, type)
      VALUES (@name, @namespace, @module, @type)
    `);

    const insertTypes = db.transaction((types: Type[]) => { //insert all types
      for(const t of types) {
        insertType.run({
          name: t.Name,
          namespace: t.Namespace || null,
          module: t.Module || null,
          constructors: JSON.stringify(t.Constructors || []),
          methods: JSON.stringify(t.Methods || []),
          properties: JSON.stringify(t.Properties || []),
        });
      }
    });

    const insertEnums = db.transaction((enums: Enum[]) => { //insert all enums
      for(const e of enums) {
        insertEnum.run({
          name: e.Name,
          namespace: e.Namespace || null,
          module: e.Module || null,
          enum_values: JSON.stringify(e.Values)
        });
      }
    });

    const insertFunctions = db.transaction((functions: Function[]) => { //insert all functions
      for(const f of functions) {
        insertFunction.run({
          name: f.Name,
          namespace: f.Namespace || null,
          module: f.Module || null,
          return_type: f.ReturnType,
          params: JSON.stringify(f.Parameters || [])
        });
      }
    });

    const insertVars = db.transaction((vars: Variable[]) => { //insert all variables
      for(const v of vars) {
        insertVar.run({
          name: v.Name,
          namespace: v.Namespace || null,
          module: v.Module || null,
          type: v.Type
        });
      }
    });

    insertTypes(info.Type);
    insertEnums(info.Enum);
    insertFunctions(info.Function);
    insertVars(info.Variable);
  });
}

async function parse_info() : Promise<as_info> {
  const pipeline = chain([
    syncfs.createReadStream("compiled_dump/as_info.json"),
    parser(),
    streamObject.streamObject(),
  ]);

  const result: Partial<as_info> = {
    Type: [],
    Enum: [],
    Function: [],
    Variable: [],
  };

  return new Promise((reslove, reject) => {
    pipeline.on('data', ({key, value}: {key: string; value: unknown}) => {
      (result as Record<string, unknown>)[key] = value;
    });

    pipeline.on('end', () => reslove(result as as_info));
    pipeline.on('error', (err) => reject(err));
  });
}

run();