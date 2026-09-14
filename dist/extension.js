"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/better-sqlite3/lib/util.js
var require_util = __commonJS({
  "node_modules/better-sqlite3/lib/util.js"(exports2) {
    "use strict";
    exports2.getBooleanOption = (options, key) => {
      let value = false;
      if (key in options && typeof (value = options[key]) !== "boolean") {
        throw new TypeError(`Expected the "${key}" option to be a boolean`);
      }
      return value;
    };
    exports2.cppdb = /* @__PURE__ */ Symbol();
    exports2.inspect = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
  }
});

// node_modules/better-sqlite3/lib/sqlite-error.js
var require_sqlite_error = __commonJS({
  "node_modules/better-sqlite3/lib/sqlite-error.js"(exports2, module2) {
    "use strict";
    var SqliteError = class _SqliteError extends Error {
      constructor(message, code) {
        if (typeof code !== "string") {
          throw new TypeError("Expected second argument to be a string");
        }
        super("" + message);
        this.code = code;
        if (typeof Error.captureStackTrace === "function") {
          Error.captureStackTrace(this, _SqliteError);
        }
      }
    };
    Object.defineProperty(SqliteError.prototype, "name", {
      value: "SqliteError",
      writable: true,
      enumerable: false,
      configurable: true
    });
    module2.exports = SqliteError;
  }
});

// node_modules/better-sqlite3/lib/methods/wrappers.js
var require_wrappers = __commonJS({
  "node_modules/better-sqlite3/lib/methods/wrappers.js"(exports2) {
    "use strict";
    var { cppdb } = require_util();
    exports2.prepare = function prepare(sql) {
      return this[cppdb].prepare(sql, this, false, false);
    };
    exports2.exec = function exec(sql) {
      this[cppdb].exec(sql);
      return this;
    };
    exports2.close = function close() {
      this[cppdb].close();
      return this;
    };
    exports2.loadExtension = function loadExtension(...args) {
      this[cppdb].loadExtension(...args);
      return this;
    };
    exports2.defaultSafeIntegers = function defaultSafeIntegers(...args) {
      this[cppdb].defaultSafeIntegers(...args);
      return this;
    };
    exports2.unsafeMode = function unsafeMode(...args) {
      this[cppdb].unsafeMode(...args);
      return this;
    };
    exports2.getters = {
      name: {
        get: function name() {
          return this[cppdb].name;
        },
        enumerable: true
      },
      open: {
        get: function open() {
          return this[cppdb].open;
        },
        enumerable: true
      },
      inTransaction: {
        get: function inTransaction() {
          return this[cppdb].inTransaction;
        },
        enumerable: true
      },
      readonly: {
        get: function readonly() {
          return this[cppdb].readonly;
        },
        enumerable: true
      },
      memory: {
        get: function memory() {
          return this[cppdb].memory;
        },
        enumerable: true
      }
    };
  }
});

// node_modules/better-sqlite3/lib/methods/transaction.js
var require_transaction = __commonJS({
  "node_modules/better-sqlite3/lib/methods/transaction.js"(exports2, module2) {
    "use strict";
    var { cppdb } = require_util();
    var controllers = /* @__PURE__ */ new WeakMap();
    module2.exports = function transaction(fn) {
      if (typeof fn !== "function") throw new TypeError("Expected first argument to be a function");
      const db2 = this[cppdb];
      const controller = getController(db2, this);
      const { apply } = Function.prototype;
      const properties = {
        default: { value: wrapTransaction(apply, fn, db2, controller.default) },
        deferred: { value: wrapTransaction(apply, fn, db2, controller.deferred) },
        immediate: { value: wrapTransaction(apply, fn, db2, controller.immediate) },
        exclusive: { value: wrapTransaction(apply, fn, db2, controller.exclusive) },
        database: { value: this, enumerable: true }
      };
      Object.defineProperties(properties.default.value, properties);
      Object.defineProperties(properties.deferred.value, properties);
      Object.defineProperties(properties.immediate.value, properties);
      Object.defineProperties(properties.exclusive.value, properties);
      return properties.default.value;
    };
    var getController = (db2, self) => {
      let controller = controllers.get(db2);
      if (!controller) {
        const shared = {
          commit: db2.prepare("COMMIT", self, false, false),
          rollback: db2.prepare("ROLLBACK", self, false, false),
          savepoint: db2.prepare("SAVEPOINT `	_bs3.	`", self, false, false),
          release: db2.prepare("RELEASE `	_bs3.	`", self, false, false),
          rollbackTo: db2.prepare("ROLLBACK TO `	_bs3.	`", self, false, false)
        };
        controllers.set(db2, controller = {
          default: Object.assign({ begin: db2.prepare("BEGIN", self, false, false) }, shared),
          deferred: Object.assign({ begin: db2.prepare("BEGIN DEFERRED", self, false, false) }, shared),
          immediate: Object.assign({ begin: db2.prepare("BEGIN IMMEDIATE", self, false, false) }, shared),
          exclusive: Object.assign({ begin: db2.prepare("BEGIN EXCLUSIVE", self, false, false) }, shared)
        });
      }
      return controller;
    };
    var wrapTransaction = (apply, fn, db2, { begin, commit, rollback, savepoint, release, rollbackTo }) => function sqliteTransaction() {
      let before, after, undo;
      if (db2.inTransaction) {
        before = savepoint;
        after = release;
        undo = rollbackTo;
      } else {
        before = begin;
        after = commit;
        undo = rollback;
      }
      before.run();
      try {
        const result = apply.call(fn, this, arguments);
        if (result && typeof result.then === "function") {
          throw new TypeError("Transaction function cannot return a promise");
        }
        after.run();
        return result;
      } catch (ex) {
        if (db2.inTransaction) {
          undo.run();
          if (undo !== rollback) after.run();
        }
        throw ex;
      }
    };
  }
});

// node_modules/better-sqlite3/lib/methods/pragma.js
var require_pragma = __commonJS({
  "node_modules/better-sqlite3/lib/methods/pragma.js"(exports2, module2) {
    "use strict";
    var { getBooleanOption, cppdb } = require_util();
    module2.exports = function pragma(source, options) {
      if (options == null) options = {};
      if (typeof source !== "string") throw new TypeError("Expected first argument to be a string");
      if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
      const simple = getBooleanOption(options, "simple");
      const stmt = this[cppdb].prepare(`PRAGMA ${source}`, this, true, false);
      return simple ? stmt.pluck().get() : stmt.all();
    };
  }
});

// node_modules/better-sqlite3/lib/methods/explain.js
var require_explain = __commonJS({
  "node_modules/better-sqlite3/lib/methods/explain.js"(exports2, module2) {
    "use strict";
    var { cppdb } = require_util();
    module2.exports = function explain(source) {
      if (typeof source !== "string") throw new TypeError("Expected first argument to be a string");
      const stmt = this[cppdb].prepare(`EXPLAIN ${source}`, this, false, true);
      return stmt.all();
    };
  }
});

// node_modules/better-sqlite3/lib/methods/backup.js
var require_backup = __commonJS({
  "node_modules/better-sqlite3/lib/methods/backup.js"(exports2, module2) {
    "use strict";
    var fs = require("fs");
    var path2 = require("path");
    var { promisify } = require("util");
    var { cppdb } = require_util();
    var fsAccess = promisify(fs.access);
    module2.exports = async function backup(filename, options) {
      if (options == null) options = {};
      if (typeof filename !== "string") throw new TypeError("Expected first argument to be a string");
      if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
      filename = filename.trim();
      const attachedName = "attached" in options ? options.attached : "main";
      const handler = "progress" in options ? options.progress : null;
      if (!filename) throw new TypeError("Backup filename cannot be an empty string");
      if (filename === ":memory:") throw new TypeError('Invalid backup filename ":memory:"');
      if (typeof attachedName !== "string") throw new TypeError('Expected the "attached" option to be a string');
      if (!attachedName) throw new TypeError('The "attached" option cannot be an empty string');
      if (handler != null && typeof handler !== "function") throw new TypeError('Expected the "progress" option to be a function');
      await fsAccess(path2.dirname(filename)).catch(() => {
        throw new TypeError("Cannot save backup because the directory does not exist");
      });
      const isNewFile = await fsAccess(filename).then(() => false, () => true);
      return runBackup(this[cppdb].backup(this, attachedName, filename, isNewFile), handler || null);
    };
    var runBackup = (backup, handler) => {
      let rate = 0;
      let useDefault = true;
      return new Promise((resolve, reject) => {
        setImmediate(function step() {
          try {
            const progress = backup.transfer(rate);
            if (!progress.remainingPages) {
              backup.close();
              resolve(progress);
              return;
            }
            if (useDefault) {
              useDefault = false;
              rate = 100;
            }
            if (handler) {
              const ret = handler(progress);
              if (ret !== void 0) {
                if (typeof ret === "number" && ret === ret) rate = Math.max(0, Math.min(2147483647, Math.round(ret)));
                else throw new TypeError("Expected progress callback to return a number or undefined");
              }
            }
            setImmediate(step);
          } catch (err) {
            backup.close();
            reject(err);
          }
        });
      });
    };
  }
});

// node_modules/better-sqlite3/lib/methods/serialize.js
var require_serialize = __commonJS({
  "node_modules/better-sqlite3/lib/methods/serialize.js"(exports2, module2) {
    "use strict";
    var { cppdb } = require_util();
    module2.exports = function serialize(options) {
      if (options == null) options = {};
      if (typeof options !== "object") throw new TypeError("Expected first argument to be an options object");
      const attachedName = "attached" in options ? options.attached : "main";
      if (typeof attachedName !== "string") throw new TypeError('Expected the "attached" option to be a string');
      if (!attachedName) throw new TypeError('The "attached" option cannot be an empty string');
      return this[cppdb].serialize(attachedName);
    };
  }
});

// node_modules/better-sqlite3/lib/methods/function.js
var require_function = __commonJS({
  "node_modules/better-sqlite3/lib/methods/function.js"(exports2, module2) {
    "use strict";
    var { getBooleanOption, cppdb } = require_util();
    module2.exports = function defineFunction(name, options, fn) {
      if (options == null) options = {};
      if (typeof options === "function") {
        fn = options;
        options = {};
      }
      if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
      if (typeof fn !== "function") throw new TypeError("Expected last argument to be a function");
      if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
      if (!name) throw new TypeError("User-defined function name cannot be an empty string");
      const safeIntegers = "safeIntegers" in options ? +getBooleanOption(options, "safeIntegers") : 2;
      const deterministic = getBooleanOption(options, "deterministic");
      const directOnly = getBooleanOption(options, "directOnly");
      const varargs = getBooleanOption(options, "varargs");
      let argCount = -1;
      if (!varargs) {
        argCount = fn.length;
        if (!Number.isInteger(argCount) || argCount < 0) throw new TypeError("Expected function.length to be a positive integer");
        if (argCount > 100) throw new RangeError("User-defined functions cannot have more than 100 arguments");
      }
      this[cppdb].function(fn, name, argCount, safeIntegers, deterministic, directOnly);
      return this;
    };
  }
});

// node_modules/better-sqlite3/lib/methods/aggregate.js
var require_aggregate = __commonJS({
  "node_modules/better-sqlite3/lib/methods/aggregate.js"(exports2, module2) {
    "use strict";
    var { getBooleanOption, cppdb } = require_util();
    module2.exports = function defineAggregate(name, options) {
      if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
      if (typeof options !== "object" || options === null) throw new TypeError("Expected second argument to be an options object");
      if (!name) throw new TypeError("User-defined function name cannot be an empty string");
      const start = "start" in options ? options.start : null;
      const step = getFunctionOption(options, "step", true);
      const inverse = getFunctionOption(options, "inverse", false);
      const result = getFunctionOption(options, "result", false);
      const safeIntegers = "safeIntegers" in options ? +getBooleanOption(options, "safeIntegers") : 2;
      const deterministic = getBooleanOption(options, "deterministic");
      const directOnly = getBooleanOption(options, "directOnly");
      const varargs = getBooleanOption(options, "varargs");
      let argCount = -1;
      if (!varargs) {
        argCount = Math.max(getLength(step), inverse ? getLength(inverse) : 0);
        if (argCount > 0) argCount -= 1;
        if (argCount > 100) throw new RangeError("User-defined functions cannot have more than 100 arguments");
      }
      this[cppdb].aggregate(start, step, inverse, result, name, argCount, safeIntegers, deterministic, directOnly);
      return this;
    };
    var getFunctionOption = (options, key, required) => {
      const value = key in options ? options[key] : null;
      if (typeof value === "function") return value;
      if (value != null) throw new TypeError(`Expected the "${key}" option to be a function`);
      if (required) throw new TypeError(`Missing required option "${key}"`);
      return null;
    };
    var getLength = ({ length }) => {
      if (Number.isInteger(length) && length >= 0) return length;
      throw new TypeError("Expected function.length to be a positive integer");
    };
  }
});

// node_modules/better-sqlite3/lib/methods/table.js
var require_table = __commonJS({
  "node_modules/better-sqlite3/lib/methods/table.js"(exports2, module2) {
    "use strict";
    var { cppdb } = require_util();
    module2.exports = function defineTable(name, factory) {
      if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
      if (!name) throw new TypeError("Virtual table module name cannot be an empty string");
      let eponymous = false;
      if (typeof factory === "object" && factory !== null) {
        eponymous = true;
        factory = defer(parseTableDefinition(factory, "used", name));
      } else {
        if (typeof factory !== "function") throw new TypeError("Expected second argument to be a function or a table definition object");
        factory = wrapFactory(factory);
      }
      this[cppdb].table(factory, name, eponymous);
      return this;
    };
    function wrapFactory(factory) {
      return function virtualTableFactory(moduleName, databaseName, tableName, ...args) {
        const thisObject = {
          module: moduleName,
          database: databaseName,
          table: tableName
        };
        const def = apply.call(factory, thisObject, args);
        if (typeof def !== "object" || def === null) {
          throw new TypeError(`Virtual table module "${moduleName}" did not return a table definition object`);
        }
        return parseTableDefinition(def, "returned", moduleName);
      };
    }
    function parseTableDefinition(def, verb, moduleName) {
      if (!hasOwnProperty.call(def, "rows")) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition without a "rows" property`);
      }
      if (!hasOwnProperty.call(def, "columns")) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition without a "columns" property`);
      }
      const rows = def.rows;
      if (typeof rows !== "function" || Object.getPrototypeOf(rows) !== GeneratorFunctionPrototype) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "rows" property (should be a generator function)`);
      }
      let columns = def.columns;
      if (!Array.isArray(columns) || !isStringArray(columns = [...columns])) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "columns" property (should be an array of strings)`);
      }
      if (columns.length !== new Set(columns).size) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with duplicate column names`);
      }
      if (!columns.length) {
        throw new RangeError(`Virtual table module "${moduleName}" ${verb} a table definition with zero columns`);
      }
      let parameters;
      if (hasOwnProperty.call(def, "parameters")) {
        parameters = def.parameters;
        if (!Array.isArray(parameters) || !isStringArray(parameters = [...parameters])) {
          throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "parameters" property (should be an array of strings)`);
        }
      } else {
        parameters = inferParameters(rows);
      }
      if (parameters.length !== new Set(parameters).size) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with duplicate parameter names`);
      }
      if (parameters.length > 32) {
        throw new RangeError(`Virtual table module "${moduleName}" ${verb} a table definition with more than the maximum number of 32 parameters`);
      }
      for (const parameter of parameters) {
        if (columns.includes(parameter)) {
          throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with column "${parameter}" which was ambiguously defined as both a column and parameter`);
        }
      }
      let safeIntegers = 2;
      if (hasOwnProperty.call(def, "safeIntegers")) {
        const bool = def.safeIntegers;
        if (typeof bool !== "boolean") {
          throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "safeIntegers" property (should be a boolean)`);
        }
        safeIntegers = +bool;
      }
      let directOnly = false;
      if (hasOwnProperty.call(def, "directOnly")) {
        directOnly = def.directOnly;
        if (typeof directOnly !== "boolean") {
          throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "directOnly" property (should be a boolean)`);
        }
      }
      const columnDefinitions = [
        ...parameters.map(identifier).map((str) => `${str} HIDDEN`),
        ...columns.map(identifier)
      ];
      return [
        `CREATE TABLE x(${columnDefinitions.join(", ")});`,
        wrapGenerator(rows, new Map(columns.map((x, i) => [x, parameters.length + i])), moduleName),
        parameters,
        safeIntegers,
        directOnly
      ];
    }
    function wrapGenerator(generator, columnMap, moduleName) {
      return function* virtualTable(...args) {
        const output = args.map((x) => Buffer.isBuffer(x) ? Buffer.from(x) : x);
        for (let i = 0; i < columnMap.size; ++i) {
          output.push(null);
        }
        for (const row of generator(...args)) {
          if (Array.isArray(row)) {
            extractRowArray(row, output, columnMap.size, moduleName);
            yield output;
          } else if (typeof row === "object" && row !== null) {
            extractRowObject(row, output, columnMap, moduleName);
            yield output;
          } else {
            throw new TypeError(`Virtual table module "${moduleName}" yielded something that isn't a valid row object`);
          }
        }
      };
    }
    function extractRowArray(row, output, columnCount, moduleName) {
      if (row.length !== columnCount) {
        throw new TypeError(`Virtual table module "${moduleName}" yielded a row with an incorrect number of columns`);
      }
      const offset = output.length - columnCount;
      for (let i = 0; i < columnCount; ++i) {
        output[i + offset] = row[i];
      }
    }
    function extractRowObject(row, output, columnMap, moduleName) {
      let count = 0;
      for (const key of Object.keys(row)) {
        const index = columnMap.get(key);
        if (index === void 0) {
          throw new TypeError(`Virtual table module "${moduleName}" yielded a row with an undeclared column "${key}"`);
        }
        output[index] = row[key];
        count += 1;
      }
      if (count !== columnMap.size) {
        throw new TypeError(`Virtual table module "${moduleName}" yielded a row with missing columns`);
      }
    }
    function inferParameters({ length }) {
      if (!Number.isInteger(length) || length < 0) {
        throw new TypeError("Expected function.length to be a positive integer");
      }
      const params = [];
      for (let i = 0; i < length; ++i) {
        params.push(`$${i + 1}`);
      }
      return params;
    }
    var { hasOwnProperty } = Object.prototype;
    var { apply } = Function.prototype;
    var GeneratorFunctionPrototype = Object.getPrototypeOf(function* () {
    });
    var identifier = (str) => `"${str.replace(/"/g, '""')}"`;
    var defer = (x) => () => x;
    var isStringArray = (arr) => {
      for (let i = 0; i < arr.length; ++i) {
        if (typeof arr[i] !== "string") return false;
      }
      return true;
    };
  }
});

// node_modules/better-sqlite3/lib/methods/inspect.js
var require_inspect = __commonJS({
  "node_modules/better-sqlite3/lib/methods/inspect.js"(exports2, module2) {
    "use strict";
    var DatabaseInspection = function Database2() {
    };
    module2.exports = function inspect(depth, opts) {
      return Object.assign(new DatabaseInspection(), this);
    };
  }
});

// node_modules/better-sqlite3/lib/database.js
var require_database = __commonJS({
  "node_modules/better-sqlite3/lib/database.js"(exports2, module2) {
    "use strict";
    var fs = require("fs");
    var path2 = require("path");
    var util = require_util();
    var SqliteError = require_sqlite_error();
    module2.exports = function createDatabase(getAddon, allowNativeBinding) {
      function Database2(filenameGiven, options) {
        if (new.target == null) {
          return new Database2(filenameGiven, options);
        }
        let buffer;
        if (Buffer.isBuffer(filenameGiven)) {
          buffer = filenameGiven;
          filenameGiven = ":memory:";
        }
        if (filenameGiven == null) filenameGiven = "";
        if (options == null) options = {};
        if (typeof filenameGiven !== "string") throw new TypeError("Expected first argument to be a string");
        if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
        if ("readOnly" in options) throw new TypeError('Misspelled option "readOnly" should be "readonly"');
        if ("memory" in options) throw new TypeError('Option "memory" was removed in v7.0.0 (use ":memory:" filename instead)');
        const filename = filenameGiven.trim();
        const anonymous = filename === "" || filename === ":memory:";
        const readonly = util.getBooleanOption(options, "readonly");
        const fileMustExist = util.getBooleanOption(options, "fileMustExist");
        const timeout = "timeout" in options ? options.timeout : 5e3;
        const verbose = "verbose" in options ? options.verbose : null;
        const nativeBinding = "nativeBinding" in options ? options.nativeBinding : null;
        if (readonly && anonymous && !buffer) throw new TypeError("In-memory/temporary databases cannot be readonly");
        if (!Number.isInteger(timeout) || timeout < 0) throw new TypeError('Expected the "timeout" option to be a positive integer');
        if (timeout > 2147483647) throw new RangeError('Option "timeout" cannot be greater than 2147483647');
        if (verbose != null && typeof verbose !== "function") throw new TypeError('Expected the "verbose" option to be a function');
        if (!allowNativeBinding && "nativeBinding" in options) throw new TypeError('The "nativeBinding" option is only supported by the default better-sqlite3 entrypoint');
        if (allowNativeBinding && nativeBinding != null && typeof nativeBinding !== "string" && typeof nativeBinding !== "object") throw new TypeError('Expected the "nativeBinding" option to be a string or addon object');
        const addon = getAddon(nativeBinding);
        if (!addon.isInitialized) {
          addon.initialize(SqliteError, arrayFactory, arrayAppender, rowFactory, recordFactory);
          addon.isInitialized = true;
        }
        if (!anonymous && !filename.startsWith("file:") && !fs.existsSync(path2.dirname(filename))) {
          throw new TypeError("Cannot open database because the directory does not exist");
        }
        Object.defineProperties(this, {
          [util.cppdb]: { value: new addon.Database(filename, filenameGiven, anonymous, readonly, fileMustExist, timeout, verbose || null, buffer || null) },
          ...wrappers.getters
        });
      }
      const wrappers = require_wrappers();
      Database2.prototype.prepare = wrappers.prepare;
      Database2.prototype.transaction = require_transaction();
      Database2.prototype.pragma = require_pragma();
      Database2.prototype.explain = require_explain();
      Database2.prototype.backup = require_backup();
      Database2.prototype.serialize = require_serialize();
      Database2.prototype.function = require_function();
      Database2.prototype.aggregate = require_aggregate();
      Database2.prototype.table = require_table();
      Database2.prototype.loadExtension = wrappers.loadExtension;
      Database2.prototype.exec = wrappers.exec;
      Database2.prototype.close = wrappers.close;
      Database2.prototype.defaultSafeIntegers = wrappers.defaultSafeIntegers;
      Database2.prototype.unsafeMode = wrappers.unsafeMode;
      Database2.prototype[util.inspect] = require_inspect();
      return Database2;
    };
    function arrayFactory(...values) {
      return values;
    }
    function arrayAppender(array, ...values) {
      const offset = array.length;
      for (let i = 0; i < values.length; ++i) {
        array[offset + i] = values[i];
      }
    }
    function rowFactory(...keys) {
      if (!keys.includes("__proto__")) {
        const parameters = keys.map((_, index) => `v${index}`).join(",");
        const properties = keys.map((key, index) => `${JSON.stringify(key)}:v${index}`).join(",");
        return Function(`return (${parameters}) => ({${properties}})`)();
      }
      return (...values) => {
        const row = {};
        for (let i = 0; i < keys.length; ++i) row[keys[i]] = values[i];
        return row;
      };
    }
    function recordFactory(value) {
      return { value, done: false };
    }
  }
});

// node_modules/better-sqlite3/lib/binding.js
var require_binding = __commonJS({
  "node_modules/better-sqlite3/lib/binding.js"(exports2, module2) {
    "use strict";
    var fs = require("fs");
    var path2 = require("path");
    var PREBUILD_PLATFORMS = ["linux", "darwin", "win32"];
    var PREBUILD_ARCHS = ["x64", "arm64"];
    var DEFAULT_ADDON;
    function getBinding(nativeBinding) {
      if (typeof nativeBinding === "string") {
        const requireFunc = typeof __non_webpack_require__ === "function" ? __non_webpack_require__ : require;
        return requireFunc(path2.resolve(nativeBinding).replace(/(\.node)?$/, ".node"));
      }
      if (typeof nativeBinding === "object" && nativeBinding !== null) {
        return nativeBinding;
      }
      if (DEFAULT_ADDON) {
        return DEFAULT_ADDON;
      }
      let filename = getPrebuildPath();
      if (filename) {
        return DEFAULT_ADDON = require(filename);
      }
      filename = path2.join(__dirname, "..", "build", "Debug", "better_sqlite3.node");
      if (!fs.existsSync(filename)) {
        filename = path2.join(__dirname, "..", "build", "Release", "better_sqlite3.node");
      }
      return DEFAULT_ADDON = require(filename);
    }
    function getPrebuildPath() {
      if (PREBUILD_PLATFORMS.includes(process.platform) && PREBUILD_ARCHS.includes(process.arch)) {
        const target = `${isLinuxMusl() ? "linuxmusl" : process.platform}-${process.arch}`;
        const filename = path2.join(__dirname, "..", "prebuilds", `${target}.node`);
        if (fs.existsSync(filename)) {
          return filename;
        }
      }
      return null;
    }
    function isLinuxMusl() {
      return process.platform === "linux" && !process.report.getReport().header.glibcVersionRuntime;
    }
    exports2.getBinding = getBinding;
    exports2.getPrebuildPath = getPrebuildPath;
    if (require.main === module2) {
      process.stdout.write(getPrebuildPath() ? "1" : "0");
    }
  }
});

// node_modules/better-sqlite3/lib/index.js
var require_lib = __commonJS({
  "node_modules/better-sqlite3/lib/index.js"(exports2, module2) {
    "use strict";
    module2.exports = require_database()(require_binding().getBinding, true);
    module2.exports.SqliteError = require_sqlite_error();
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var import_better_sqlite3 = __toESM(require_lib());
var path = __toESM(require("path"));
var db = null;
var searchFunctions;
var searchVariables;
var searchTypes;
var searchEnums;
var searchTypeMethods;
function activate(context) {
  console.log("ITT Angelscript Autocomplete Active");
  const dbPath = path.join(context.extensionPath, "data", "symbols.db");
  const nativeBindingPath = path.join(
    context.extensionPath,
    "build",
    "Release",
    "better_sqlite3.node"
  );
  try {
    db = new import_better_sqlite3.default(dbPath, {
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
  const providerOptions = {
    scheme: "file",
    language: "angelscript"
  };
  const provider = vscode.languages.registerCompletionItemProvider(providerOptions, { provideCompletionItems(document, position, token, context2) {
    if (!db) {
      return [];
    }
    const lineText = document.lineAt(position).text;
    const lineUntilCursor = lineText.substring(0, position.character);
    const memberMatch = lineUntilCursor.match(/([a-zA-Z_][a-zA-Z0-9_]*)(?:\.|\:\:)$/);
    if (memberMatch) {
      const typeName = memberMatch[1];
      return getMemberCompletions(typeName);
    }
    const wordMatch = lineUntilCursor.match(/([a-zA-Z_][a-zA-Z0-9_]*)$/);
    const prefix = wordMatch ? wordMatch[1] : "";
    if (!prefix && context2.triggerKind !== vscode.CompletionTriggerKind.Invoke) {
      return [];
    }
    return getGlobalCompletions(prefix, lineUntilCursor);
  } }, ".", ":");
  context.subscriptions.push(provider);
}
function getMemberCompletions(typename) {
  const items = [];
  const record = searchTypeMethods.get(typename);
  if (!record) {
    return items;
  }
  const methods = JSON.parse(record.methods || "[]");
  for (const m of methods) {
    const item = new vscode.CompletionItem(m.Name, vscode.CompletionItemKind.Method);
    const paramsStr = (m.Parameters || []).map((p) => `${p.Type} ${p.Name}`).join(", ");
    item.detail = `${m.ReturnType} ${m.Name}(${paramsStr})`;
    items.push(item);
  }
  const properties = JSON.parse(record.properties || "[]");
  for (const p of properties) {
    const item = new vscode.CompletionItem(p.Name, vscode.CompletionItemKind.Field);
    item.detail = `${p.Type} ${p.Name}`;
    items.push(item);
  }
  return items;
}
function getGlobalCompletions(prefix, lineUntilCursor) {
  const items = [];
  const isNewKeyword = /\bnew\s+[a-zA-Z0-9_]*$/.test(lineUntilCursor);
  const types = searchTypes.all(prefix);
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
  const funcs = searchFunctions.all(prefix);
  for (const f of funcs) {
    const item = new vscode.CompletionItem(f.name, vscode.CompletionItemKind.Function);
    const parsedParams = JSON.parse(f.params || "[]");
    const params = parsedParams.map((p) => `${p.Type} ${p.Name}`).join(", ");
    item.detail = `${f.return_type} ${f.name}(${params})`;
    items.push(item);
  }
  const vars = searchVariables.all(prefix);
  for (const v of vars) {
    const item = new vscode.CompletionItem(v.name, vscode.CompletionItemKind.Variable);
    item.detail = `${v.type} ${v.name}`;
    items.push(item);
  }
  const enums = searchEnums.all(prefix);
  for (const e of enums) {
    const item = new vscode.CompletionItem(e.name, vscode.CompletionItemKind.Enum);
    items.push(item);
  }
  return items;
}
function deactivate() {
  if (db) {
    db.close();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
