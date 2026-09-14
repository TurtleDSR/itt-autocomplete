import * as vscode from 'vscode';
import Database from 'better-sqlite3';
import * as path from 'path';
import { Param } from './parse/interface';

let db: Database.Database | null = null;

let searchFunctions: Database.Statement;
let searchVariables: Database.Statement;
let searchTypes: Database.Statement;
let searchEnums: Database.Statement;
let searchTypeMethods: Database.Statement;

export function activate(context: vscode.ExtensionContext) {
  console.log("ITT Angelscript Autocomplete Active");
  
  const dbPath = path.join(context.extensionPath, 'data', 'symbols.db');

  const nativeBindingPath = path.join(
    context.extensionPath,
    'build',
    'Release',
    'better_sqlite3.node'
  );

  try {
    db = new Database(dbPath, {
      readonly: true,
      nativeBinding: nativeBindingPath
    });
    
    searchFunctions = db.prepare(`
      SELECT name, return_type, params FROM functions 
      WHERE name LIKE ? || '%' LIMIT 40
    `);
    
    searchVariables = db.prepare(`
      SELECT name, type FROM variables 
      WHERE name LIKE ? || '%' LIMIT 40
    `);

    searchTypes = db.prepare(`
      SELECT name, constructors, methods, properties FROM types 
      WHERE name LIKE ? || '%' LIMIT 40
    `);

    searchEnums = db.prepare(`
      SELECT name, enum_values FROM enums 
      WHERE name LIKE ? || '%' LIMIT 40
    `);

    searchTypeMethods = db.prepare(`
      SELECT methods, properties FROM types WHERE name = ? LIMIT 1
    `);
  } catch (err) {
    vscode.window.showErrorMessage(`Failed to load symbol database: ${err}`);
    return;
  }

  const providerOptions: vscode.DocumentSelector = {
    scheme: 'file',
    language: 'angelscript'
  };
  
  const provider = vscode.languages.registerCompletionItemProvider(providerOptions, {provideCompletionItems(document, position, token, context) : vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    if(!db) {return [];}

    const lineText = document.lineAt(position).text;
    const lineUntilCursor = lineText.substring(0, position.character);

    const memberMatch = lineUntilCursor.match(/([a-zA-Z_][a-zA-Z0-9_]*)(?:\.|\:\:)$/);
    if(memberMatch) {
      const typeName = memberMatch[1];
      return getMemberCompletions(typeName);
    }

    const wordMatch = lineUntilCursor.match(/([a-zA-Z_][a-zA-Z0-9_]*)$/);
    const prefix = wordMatch ? wordMatch[1] : '';

    if(!prefix && context.triggerKind !== vscode.CompletionTriggerKind.Invoke) {
      return [];
    }

    return getGlobalCompletions(prefix, lineUntilCursor);
  }}, '.', ':');

  context.subscriptions.push(provider); //register provider
}

function getMemberCompletions(typename: string) : vscode.CompletionItem[] {
  const items: vscode.CompletionItem[] = [];
  const record = searchTypeMethods.get(typename) as { methods?: string; properties?: string } | undefined;

  if(!record) {return items;}

  const methods = JSON.parse(record.methods || '[]');
  for (const m of methods) {
    const item = new vscode.CompletionItem(m.Name, vscode.CompletionItemKind.Method);
    const paramsStr = (m.Parameters || []).map((p: any) => `${p.Type} ${p.Name}`).join(', ');
    item.detail = `${m.ReturnType} ${m.Name}(${paramsStr})`;
    items.push(item);
  }

  const properties = JSON.parse(record.properties || '[]');
  for (const p of properties) {
    const item = new vscode.CompletionItem(p.Name, vscode.CompletionItemKind.Field);
    item.detail = `${p.Type} ${p.Name}`;
    items.push(item);
  }

  return items;
}

function getGlobalCompletions(prefix: string, lineUntilCursor : string) : vscode.CompletionItem[] {
  const items: vscode.CompletionItem[] = [];

  const isNewKeyword = /\bnew\s+[a-zA-Z0-9_]*$/.test(lineUntilCursor);

  const types = searchTypes.all(prefix) as Array<{ name: string; constructors: string }>;
  for (const t of types) {
    const item = new vscode.CompletionItem(t.name, vscode.CompletionItemKind.Class);
    
    item.detail = `class ${t.name}`;
    if (isNewKeyword) {
      item.insertText = new vscode.SnippetString(`${t.name}($1)`);
    } else {
      item.insertText = t.name;
    }

    items.push(item);
  }

  const funcs = searchFunctions.all(prefix) as Array<{name: string; return_type: string; params: string}>;
  for(const f of funcs) {
    const item = new vscode.CompletionItem(f.name, vscode.CompletionItemKind.Function);

    const parsedParams = JSON.parse(f.params || '[]');
    const params = parsedParams.map((p: Param) => `${p.Type} ${p.Name}`).join(', ');

    item.detail = `${f.return_type} ${f.name}(${params})`;
    items.push(item);
  }

  const vars = searchVariables.all(prefix) as Array<{name: string; type: string}>;
  for(const v of vars) {
    const item = new vscode.CompletionItem(v.name, vscode.CompletionItemKind.Variable);

    item.detail = `${v.type} ${v.name}`;
    items.push(item);
  }

  const enums = searchEnums.all(prefix) as Array<{ name: string }>;
  for (const e of enums) {
    const item = new vscode.CompletionItem(e.name, vscode.CompletionItemKind.Enum);
    items.push(item);
  }

  return items;
}

export function deactivate() {
  if(db) {
    db.close();
  }
}