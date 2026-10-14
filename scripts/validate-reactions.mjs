import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const source = await readFile(new URL('../src/data/mockReactions.ts', import.meta.url), 'utf8');
const { outputText, diagnostics } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  reportDiagnostics: true,
});

if (diagnostics?.some((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)) {
  throw new Error('Could not compile reaction data for validation.');
}

const reactionModule = { exports: {} };
runInNewContext(outputText, { exports: reactionModule.exports, module: reactionModule });
reactionModule.exports.validatePublishedReactions(reactionModule.exports.reactions);
console.log(`Validated ${reactionModule.exports.reactions.length} published reaction entries.`);
