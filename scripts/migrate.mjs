import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');

async function transpile(filePath) {
  const source = await readFile(new URL(filePath, import.meta.url), 'utf8');
  const { outputText, diagnostics } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    reportDiagnostics: true,
  });
  if (diagnostics?.some((d) => d.category === ts.DiagnosticCategory.Error)) {
    throw new Error(`Could not compile ${filePath}`);
  }
  return outputText;
}

async function loadModule(filePath, mocks = {}) {
  const code = await transpile(filePath);
  const moduleObj = { exports: {} };
  const context = {
    exports: moduleObj.exports,
    module: moduleObj,
    require: (name) => {
      if (name in mocks) return mocks[name];
      return require(name);
    },
    process,
  };
  runInNewContext(code, context);
  return moduleObj.exports;
}

const { normalizePair } = await loadModule('../src/lib/repository.ts');
const { elements, reactions } = await loadModule('../src/data/mockReactions.ts');
const { runMigration, countElements } = await loadModule('../src/lib/migrate.ts', {
  '@/data/mockReactions': { elements, reactions },
  '@/lib/repository': { normalizePair },
});

const dbPath = process.env.DATABASE_PATH || `${process.cwd()}/.data/app.db`;
const db = runMigration(dbPath);

console.log(`Database: ${dbPath}`);
console.log(`Elements: ${countElements(db)}`);
const rxCount = db.prepare('SELECT COUNT(*) AS count FROM reactions').get().count;
console.log(`Reactions: ${rxCount}`);
db.close();
console.log('Migration complete.');
