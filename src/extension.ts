import * as vscode from 'vscode';
import Database from 'better-sqlite3';
import * as path from 'path';
import { Param } from './parse/interface';

let db: Database.Database | null = null;

let searchFunctionsFromName: Database.Statement;
let searchVariablesFromName: Database.Statement;
let searchTypesFromName: Database.Statement;
let searchEnumsFromName: Database.Statement;
let searchFunctionsFromNamespace: Database.Statement;
let searchVariablesFromNamespace: Database.Statement;
let searchTypesFromNamespace: Database.Statement;
let searchEnumsFromNamespace: Database.Statement;
let searchNamespaces: Database.Statement;

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
    
    searchFunctionsFromName = db.prepare(`
      SELECT name, namespace, module, return_type, params FROM functions 
      WHERE LOWER(name) LIKE LOWER(?) || '%'
    `);
    
    searchVariablesFromName = db.prepare(`
      SELECT name, namespace, module, type FROM variables 
      WHERE LOWER(name) LIKE LOWER(?) || '%'
    `);

    searchTypesFromName = db.prepare(`
      SELECT name, namespace, module, constructors, methods, properties FROM types 
      WHERE LOWER(name) LIKE LOWER(?) || '%'
    `);

    searchEnumsFromName = db.prepare(`
      SELECT name, namespace, module, enum_values FROM enums 
      WHERE LOWER(name) LIKE LOWER(?) || '%'
    `);

    //from namespace
    searchFunctionsFromNamespace = db.prepare(`
      SELECT name, namespace, module, return_type, params FROM functions 
      WHERE namespace = ? COLLATE NOCASE
    `);
    
    searchVariablesFromNamespace = db.prepare(`
      SELECT name, namespace, module, type FROM variables 
      WHERE namespace = ? COLLATE NOCASE
    `);

    searchTypesFromNamespace = db.prepare(`
      SELECT name, namespace, module, constructors, methods, properties FROM types 
      WHERE namespace = ? COLLATE NOCASE
    `);

    searchEnumsFromNamespace = db.prepare(`
      SELECT name, namespace, module, enum_values FROM enums 
      WHERE namespace = ? COLLATE NOCASE
    `);

    //namespace table
    searchNamespaces = db.prepare(`
      SELECT namespace, module FROM namespaces 
      WHERE LOWER(namespace) LIKE LOWER(?) || '%'
    `);

  } catch (err) {
    vscode.window.showErrorMessage(`Failed to load symbol database: ${err}`);
    return;
  }

  const providerOptions: vscode.DocumentSelector = {
    scheme: 'file',
    language: 'angelscript'
  };
  
  const provider = vscode.languages.registerCompletionItemProvider(providerOptions, {provideCompletionItems(document, position, token, context) : vscode.ProviderResult<vscode.CompletionItem[]> {
    if(!db) {return [];}

    const lineText = document.lineAt(position).text;
    const lineUntilCursor = lineText.substring(0, position.character);

    const memberMatch = lineUntilCursor.match(/([a-zA-Z_][a-zA-Z0-9_]*)(\.|::)$/);
    if (memberMatch) {
      const [, identifier, delimiter] = memberMatch;

      if (delimiter === '::') {
        return getNamespaceCompletions(identifier, document);
      } else {
        return getMemberCompletions(identifier, document);
      }
    }

    const wordMatch = lineUntilCursor.match(/([a-zA-Z_][a-zA-Z0-9_]*)$/);
    const prefix = wordMatch ? wordMatch[1] : '';

    if(!prefix && context.triggerKind !== vscode.CompletionTriggerKind.Invoke) {
      return [];
    }

    return getGlobalCompletions(prefix, lineUntilCursor, document);
  }}, '.', ':');

  context.subscriptions.push(provider); //register provider
}

export function deactivate() {
  if(db) {
    db.close();
  }
}

function getMemberCompletions(typename: string, document : vscode.TextDocument) : vscode.CompletionItem[] {
  const items: vscode.CompletionItem[] = [];
  const typerecord = searchTypesFromName.get(typename) as { methods?: string; properties?: string; module?: string; namespace?: string } | undefined;

  if(typerecord) {
    const methods = JSON.parse(typerecord.methods || '[]');
    for (const m of methods) {
      const item = new vscode.CompletionItem(m.Name, vscode.CompletionItemKind.Method);

      const parsedParams = JSON.parse(m.params || '[]');
      const params = parsedParams
      .map((p: Param) => {
        const type = p.Type ? p.Type.trim() : '';
        const name = p.Name ? p.Name.trim() : '';
        const defaultValue = p.default ? ` = ${p.default.trim()}` : '';
      
        return [type, name].filter(Boolean).join(' ') + defaultValue;
      })
      .filter(Boolean)
      .join(', ');

      item.detail = `${m.ReturnType} ${m.Name}(${params})`;
      item.insertText = new vscode.SnippetString(`${m.Name}($1);`);
      item.documentation = buildDoc(m.module, m.namespace);

      if(m.module) {attemptImport(m.module, item, document);}

      items.push(item);
    }

    const properties = JSON.parse(typerecord.properties || '[]');
    for (const p of properties) {
      const item = new vscode.CompletionItem(p.Name, vscode.CompletionItemKind.Field);
      item.detail = `${p.Type} ${p.Name}`;
      item.documentation = buildDoc(p.module, p.namespace);

      if(p.module) {attemptImport(p.module, item, document);}

      items.push(item);
    }
  }

  const enumrecord = searchEnumsFromName.get(typename) as { name: string, enum_values?: string; module?: string; namespace?: string } | undefined;
  if(enumrecord && enumrecord.enum_values) {
    const values = JSON.parse(enumrecord.enum_values);
    for(const v of values) {
      const item = new vscode.CompletionItem(v, vscode.CompletionItemKind.EnumMember);
      item.detail = `${v}`;
      item.documentation = buildDoc(enumrecord.module, enumrecord.namespace);

      if(enumrecord.module) {attemptImport(enumrecord.module, item, document);}

      items.push(item);
    }
  }

  return items;
}

function getNamespaceCompletions(namespace: string, document : vscode.TextDocument) : vscode.CompletionItem[] {
  const items: vscode.CompletionItem[] = [];

  const funcs = searchFunctionsFromNamespace.all(namespace) as Array<{ name: string; return_type: string; params: string; module?: string; namespace?: string }>;
  for(const f of funcs) {
    const item = new vscode.CompletionItem(f.name, vscode.CompletionItemKind.Function);

    const parsedParams = JSON.parse(f.params || '[]');
    const params = parsedParams
    .map((p: Param) => {
      const type = p.Type ? p.Type.trim() : '';
      const name = p.Name ? p.Name.trim() : '';
      const defaultValue = p.default ? ` = ${p.default.trim()}` : '';

      return [type, name].filter(Boolean).join(' ') + defaultValue;
    })
    .filter(Boolean)
    .join(', ');

    item.detail = `${f.return_type} ${f.name}(${params})`;

    item.insertText = new vscode.SnippetString(`${f.name}($1);`);

    item.documentation = buildDoc(f.module, f.namespace);

    if(f.module) {attemptImport(f.module, item, document);}

    items.push(item);
  }

  const vars = searchVariablesFromNamespace.all(namespace) as Array<{ name: string; type: string; module?: string; namespace?: string }>;
  for(const v of vars) {
    const item = new vscode.CompletionItem(v.name, vscode.CompletionItemKind.Variable);

    item.detail = `${v.type} ${v.name}`;

    item.insertText = new vscode.SnippetString(`${v.name};`);
    item.documentation = buildDoc(v.module, v.namespace);

    if(v.module) {attemptImport(v.module, item, document);}

    items.push(item);
  }

  const enums = searchEnumsFromNamespace.all(namespace) as Array<{ name: string; module?: string; namespace?: string }>;
  for (const e of enums) {
    const item = new vscode.CompletionItem(e.name, vscode.CompletionItemKind.Enum);
    item.detail = `enum ${e.name}`;

    item.insertText = new vscode.SnippetString(`${e.name}`);
    item.documentation = buildDoc(e.module, e.namespace);

    if(e.module) {attemptImport(e.module, item, document);}

    items.push(item);
  }

  const types = searchTypesFromNamespace.all(namespace) as Array<{ name: string; methods: string; module?: string; namespace?: string }>;
  for (const t of types) {
    const item = new vscode.CompletionItem(t.name, vscode.CompletionItemKind.Class);
    item.detail = `class ${t.name}`;

    item.insertText = new vscode.SnippetString(`${t.name}`);

    item.documentation = buildDoc(t.module, t.namespace);

    if(t.module) {attemptImport(t.module, item, document);}

    items.push(item);
  }

  return items;
}

function getGlobalCompletions(prefix: string, lineUntilCursor : string, document : vscode.TextDocument) : vscode.CompletionItem[] {
  const items: vscode.CompletionItem[] = [];

  const isNewKeyword = /\bnew\s+[a-zA-Z0-9_]*$/.test(lineUntilCursor);

  if (isNewKeyword) {
    const types = searchTypesFromName.all(prefix) as Array<{ name: string; constructors: string; module?: string; namespace?: string }>;
    for (const t of types) {
      const item = new vscode.CompletionItem(t.name, vscode.CompletionItemKind.Constructor);

      const constructors = JSON.parse(t.constructors || '[]');
      if (constructors.length > 0) {
        for (const c of constructors) {
          const parsedParams = JSON.parse(c.params || '[]');
          const params = parsedParams
          .map((p: Param) => {
            const type = p.Type ? p.Type.trim() : '';
            const name = p.Name ? p.Name.trim() : '';
            const defaultValue = p.default ? ` = ${p.default.trim()}` : '';
          
            return [type, name].filter(Boolean).join(' ') + defaultValue;
          })
          .filter(Boolean)
          .join(', ');

          const constructorItem = new vscode.CompletionItem(t.name, vscode.CompletionItemKind.Constructor);
          
          constructorItem.detail = `${t.name}(${params})`;
          constructorItem.insertText = new vscode.SnippetString(`${t.name}($1);`);
          constructorItem.documentation = buildDoc(t.module, t.namespace);

          if(t.module) {attemptImport(t.module, item, document);}

          items.push(constructorItem);
        }
      } else {
        item.detail = `${t.name}()`;
        item.insertText = new vscode.SnippetString(`${t.name}($1);`);
        item.documentation = buildDoc(t.module, t.namespace);

        if(t.module) {attemptImport(t.module, item, document);}

        items.push(item);
      }
    }
    return items;
  } else {
    const namespaces = searchNamespaces.all(prefix) as Array<{ namespace: string; module: string }>;
    for (const n of namespaces) {
      const item = new vscode.CompletionItem(n.namespace, vscode.CompletionItemKind.Module);

      item.detail = `namespace ${n.namespace}`;
      item.insertText = new vscode.SnippetString(`${n.namespace}::`);
      item.documentation = buildDoc(n.module);

      item.command = {
        command: 'editor.action.triggerSuggest',
        title: 'trigger-suggest'
      };

      if(n.module) {attemptImport(n.module, item, document);}

      items.push(item);
    }

    const types = searchTypesFromName.all(prefix) as Array<{ name: string; methods: string; module?: string; namespace?: string }>;
    for (const t of types) {
      const item = new vscode.CompletionItem(t.name, vscode.CompletionItemKind.Class);

      item.detail = `class ${t.name}`;

      const ns : string = t.namespace ? `${t.namespace}::` : '';
      item.insertText = new vscode.SnippetString(`${ns}${t.name}`);

      item.documentation = buildDoc(t.module, t.namespace);

      if(t.module) {attemptImport(t.module, item, document);}

      items.push(item);
    }
  }

  const funcs = searchFunctionsFromName.all(prefix) as Array<{ name: string; return_type: string; params: string; module?: string; namespace?: string }>;
  for(const f of funcs) {
    const item = new vscode.CompletionItem(f.name, vscode.CompletionItemKind.Function);

    const parsedParams = JSON.parse(f.params || '[]');
    const params = parsedParams
    .map((p: Param) => {
      const type = p.Type ? p.Type.trim() : '';
      const name = p.Name ? p.Name.trim() : '';
      const defaultValue = p.default ? ` = ${p.default.trim()}` : '';

      return [type, name].filter(Boolean).join(' ') + defaultValue;
    })
    .filter(Boolean)
    .join(', ');

    item.detail = `${f.return_type} ${f.name}(${params})`;

    const ns : string = f.namespace ? `${f.namespace}::` : '';
    item.insertText = new vscode.SnippetString(`${ns}${f.name}($1);`);

    item.documentation = buildDoc(f.module, f.namespace);

    if(f.module) {attemptImport(f.module, item, document);}

    items.push(item);
  }

  const vars = searchVariablesFromName.all(prefix) as Array<{ name: string; type: string; module?: string; namespace?: string }>;
  for(const v of vars) {
    const item = new vscode.CompletionItem(v.name, vscode.CompletionItemKind.Variable);

    item.detail = `${v.type} ${v.name}`;

    const ns : string = v.namespace ? `${v.namespace}::` : '';
    item.insertText = new vscode.SnippetString(`${ns}${v.name};`);
    item.documentation = buildDoc(v.module, v.namespace);

    if(v.module) {attemptImport(v.module, item, document);}

    items.push(item);
  }

  const enums = searchEnumsFromName.all(prefix) as Array<{ name: string; module?: string; namespace?: string }>;
  for (const e of enums) {
    const item = new vscode.CompletionItem(e.name, vscode.CompletionItemKind.Enum);
    item.detail = `enum ${e.name}`;

    const ns : string = e.namespace ? `${e.namespace}::` : '';
    item.insertText = new vscode.SnippetString(`${ns}${e.name}`);
    item.documentation = buildDoc(e.module, e.namespace);

    if(e.module) {attemptImport(e.module, item, document);}

    items.push(item);
  }

  return items;
}

function buildDoc(moduleName?: string, namespaceName?: string): vscode.MarkdownString {
  const md = new vscode.MarkdownString();
  md.isTrusted = true;

  const mod = moduleName || 'Global';
  const ns = namespaceName ? `\n\n**Namespace:** \`${namespaceName}\`` : '';
  
  md.appendMarkdown(`**Source:** \`${mod}\`${ns}`);
  return md;
}

function attemptImport(module : string, item : vscode.CompletionItem, document : vscode.TextDocument) {
  const text = document.getText();
  const hasImport = text.includes(`import ${module};`);

  if (!hasImport) {
    item.additionalTextEdits = [
      vscode.TextEdit.insert(new vscode.Position(getImportInsertionLine(document), 0), `import ${module};\n`)
    ];
  }
}

function getImportInsertionLine(document: vscode.TextDocument): number {
  let lastImportLine = -1;
  let firstEmptyLine = -1;
  let inBlockComment = false;

  for (let i = 0; i < document.lineCount; i++) {
    const lineText = document.lineAt(i).text.trim();

    if (inBlockComment) {
      if (lineText.includes('*/')) {inBlockComment = false;}
      continue;
    }
    if (lineText.startsWith('/*')) {
      if (!lineText.includes('*/')) {inBlockComment = true;}
      continue;
    }

    if (lineText.startsWith('//')) {
      continue;
    }

    if (lineText === '' && firstEmptyLine === -1) {
      firstEmptyLine = i;
    }

    if (lineText.startsWith('import ')) {
      lastImportLine = i;
    }

    if (
      lastImportLine === -1 &&
      /^(UCLASS|USTRUCT|UENUM|UINTERFACE|class|struct|enum|namespace|event|funcdef)\b/.test(lineText)
    ) {
      break;
    }
  }

  if (lastImportLine !== -1) {
    return lastImportLine + 1;
  }

  if (firstEmptyLine !== -1) {
    return firstEmptyLine;
  }

  return 0;
}