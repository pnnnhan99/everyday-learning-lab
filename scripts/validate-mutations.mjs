import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import { strict as assert } from 'node:assert';

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

const { validateReaction } = await loadModule('../src/types/game.ts');

assert.equal(validateReaction({ element1Id: 'a', element2Id: 'b', resultTitle: 'T', observation: 'o', explanation: 'e' }).ok, false, 'should reject missing safety metadata');

assert.equal(validateReaction({ element1Id: 'a', element2Id: 'b', resultTitle: 'T', observation: 'o', explanation: 'e', effectType: 'explosion', reviewStatus: 'reviewed', assumptions: ['a'], safetyGuidance: 'g', references: [{ title: 't', publisher: 'p', url: 'https://x.com' }] }).ok, false, 'should reject stale effectType');

assert.equal(validateReaction({ element1Id: 'a', element2Id: 'b', resultTitle: 'T', observation: 'o', explanation: 'e', effectType: 'informational', reviewStatus: 'reviewed', assumptions: ['a'], safetyGuidance: 'g', references: [{ title: 't', publisher: 'p', url: 'http://x.com' }] }).ok, false, 'should reject non-HTTPS reference');

assert.equal(validateReaction({ element1Id: 'a', element2Id: 'b', resultTitle: 'T', observation: 'o', explanation: 'e', effectType: 'informational', reviewStatus: 'reviewed', assumptions: ['a'], safetyGuidance: 'g', references: [{ title: 't', publisher: 'p', url: 'https://x.com' }] }).ok, true, 'should accept valid reaction');

console.log('✓ validateReaction rejects missing safety metadata');
console.log('✓ validateReaction rejects stale effectType');
console.log('✓ validateReaction rejects non-HTTPS reference');
console.log('✓ validateReaction accepts valid reaction');

const { isDuplicatePair, normalizePair } = await loadModule('../src/lib/repository.ts');

assert.equal(isDuplicatePair({ element1Id: 'a', element2Id: 'b' }, { element1Id: 'a', element2Id: 'b' }), true, 'same pair should be duplicate');
assert.equal(isDuplicatePair({ element1Id: 'a', element2Id: 'b' }, { element1Id: 'b', element2Id: 'a' }), true, 'reversed pair should be duplicate');
assert.equal(isDuplicatePair({ element1Id: 'a', element2Id: 'b' }, { element1Id: 'c', element2Id: 'd' }), false, 'different pairs should not be duplicate');
console.log('✓ isDuplicatePair detects duplicates (order-independent)');

assert.equal(normalizePair('a', 'b'), 'a|b', 'normalizePair sorts ascending');
assert.equal(normalizePair('b', 'a'), 'a|b', 'normalizePair is order-independent');
assert.equal(normalizePair('lemon', 'baking-soda'), 'baking-soda|lemon', 'normalizePair sorts by string comparison');
console.log('✓ normalizePair produces order-independent keys');

const { checkAuth } = await loadModule('../src/lib/auth.ts', {
  'next/server': { NextResponse: { json: (data, init) => ({ data, init }) } },
});

assert.equal(checkAuth({ headers: { get: () => null } }), false, 'deny when no token configured');

process.env.MAINTAINER_TOKEN = 'secret-token';
assert.equal(checkAuth({ headers: { get: () => 'Bearer wrong' } }), false, 'deny wrong token');
assert.equal(checkAuth({ headers: { get: () => 'Bearer secret-token' } }), true, 'allow correct token');
assert.equal(checkAuth({ headers: { get: () => null } }), false, 'deny missing auth header');
assert.equal(checkAuth({ headers: { get: () => 'Basic secret-token' } }), false, 'deny non-Bearer scheme');

delete process.env.MAINTAINER_TOKEN;
assert.equal(checkAuth({ headers: { get: () => 'Bearer secret-token' } }), false, 'deny when token env cleared');
console.log('✓ checkAuth: fail-safe deny, correct allow, wrong token, missing header, non-Bearer scheme, env-cleared deny');

console.log('\nAll mutation security validations passed.');
