import { readFile } from 'node:fs/promises';
import { unlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const Database = require('better-sqlite3');

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

const { normalizePair, isDuplicatePair } = await loadModule('../src/lib/repository.ts');
const { elements: seedElements, reactions: seedReactions } = await loadModule('../src/data/mockReactions.ts');
const migrateModule = await loadModule('../src/lib/migrate.ts', {
  '@/data/mockReactions': { elements: seedElements, reactions: seedReactions },
  '@/lib/repository': { normalizePair, isDuplicatePair },
});

const createSchema = migrateModule.createSchema;
const seedDatabase = migrateModule.seedDatabase;
const countElements = migrateModule.countElements;

let passed = 0;
let failed = 0;

function check(name, cond) {
  if (cond) {
    passed++;
    console.log(`  \u2713 ${name}`);
  } else {
    failed++;
    console.error(`  \u2717 ${name}`);
  }
}

function checkThrows(name, fn, expectedMsg) {
  try {
    fn();
    check(name, false);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const code = err.code || '';
    check(name, expectedMsg ? (code.startsWith(expectedMsg) || msg.includes(expectedMsg)) : true);
  }
}

const dbPath = join(tmpdir(), `test-persistence-${Date.now()}.db`);
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log('\n--- Persistence Validation ---\n');

console.log('Schema:');
createSchema(db);
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
check('elements table exists', tables.some((t) => t.name === 'elements'));
check('reactions table exists', tables.some((t) => t.name === 'reactions'));
check('reactions has normalized_pair column', db.prepare("PRAGMA table_info(reactions)").all().some((c) => c.name === 'normalized_pair'));

console.log('\nSeed data:');
if (countElements(db) === 0) {
  seedDatabase(db);
}
check('seeded 4 elements', countElements(db) === 4);
check('seeded 2 reactions', db.prepare('SELECT COUNT(*) AS count FROM reactions').get().count === 2);

console.log('\nElement CRUD:');
const lemonBefore = db.prepare('SELECT * FROM elements WHERE id = ?').get('lemon');
check('element exists by id', lemonBefore !== undefined);
check('element has correct name', lemonBefore && lemonBefore.name === 'Lemon Juice');

checkThrows('duplicate element id rejected', () => {
  db.prepare('INSERT INTO elements (id, name, icon, description, type) VALUES (?, ?, ?, ?, ?)').run('lemon', 'Dupe', 'flask', 'Dupe', 'chemical');
}, 'SQLITE_CONSTRAINT');

db.prepare('UPDATE elements SET name = ? WHERE id = ?').run('Updated Lemon', 'lemon');
const lemonAfter = db.prepare('SELECT * FROM elements WHERE id = ?').get('lemon');
check('element updated', lemonAfter.name === 'Updated Lemon');

db.prepare('DELETE FROM reactions WHERE normalized_pair = ?').run('bleach|vinegar');
db.prepare('DELETE FROM elements WHERE id = ?').run('vinegar');
check('element deleted', countElements(db) === 3);

console.log('\nReaction pair uniqueness:');
const pair = db.prepare('SELECT * FROM reactions WHERE normalized_pair = ?').get('baking-soda|lemon');
check('reaction found by normalized pair', pair !== undefined);
check('reversed pair uses same normalized key', normalizePair('baking-soda', 'lemon') === normalizePair('lemon', 'baking-soda'));

checkThrows('duplicate reaction pair (reversed) rejected', () => {
  db.prepare(`
    INSERT INTO reactions (element1_id, element2_id, result_title, observation, explanation,
      effect_type, review_status, safety_guidance, assumptions, "references")
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('baking-soda', 'lemon', 'Dupe', 'o', 'e', 'informational', 'reviewed', 's', '[]', '[]');
}, 'SQLITE_CONSTRAINT');

console.log('\nJSON storage:');
const rx = db.prepare('SELECT * FROM reactions WHERE normalized_pair = ?').get('baking-soda|lemon');
const assumptions = JSON.parse(rx.assumptions);
const references = JSON.parse(rx.references);
check('assumptions parsed as array', Array.isArray(assumptions));
check('assumptions has entries', assumptions.length === 2);
check('references parsed as array', Array.isArray(references));
check('reference has HTTPS url', references[0].url.startsWith('https://'));

console.log('\nPersistence across restart:');
db.close();
const db2 = new Database(dbPath);
db2.pragma('foreign_keys = ON');
check('elements persisted after restart', countElements(db2) === 3);
check('reactions persisted after restart', db2.prepare('SELECT COUNT(*) AS count FROM reactions').get().count === 1);
check('updated element persisted', db2.prepare('SELECT name FROM elements WHERE id = ?').get('lemon').name === 'Updated Lemon');

createSchema(db2);
check('schema re-init is idempotent', countElements(db2) === 3);

db2.close();
unlinkSync(dbPath);

console.log(`\n${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
}
console.log('\nAll persistence validations passed.');
