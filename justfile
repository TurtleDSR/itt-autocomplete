dump:
  @[ -d compiled_dump/ ] || mkdir -p compiled_dump/
  npx tsx src/parse/parser.ts

db:
  @[ -d data/ ] || mkdir -p data/
  @[ -f data/symbols.db ] && rm data/symbols.db
  npx tsx src/parse/db.ts

precompile: dump db

watch:
  npm run watch

build:
  @[ -d bin/ ] || mkdir -p bin/
  vsce package -o bin/