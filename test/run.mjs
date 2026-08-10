import { run } from 'node:test';
import { spec as SpecReporter } from 'node:test/reporters';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import process from 'node:process';

// Discover compiled test files. Using the programmatic runner (instead of the
// `node --test <dir>` CLI) keeps behavior identical across Node versions.
const testDir = path.resolve('.test-out/test');
const files = readdirSync(testDir)
    .filter((name) => name.endsWith('.test.mjs'))
    .map((name) => path.join(testDir, name));

// `run({ files })` executes each test file in a separate child process, so the
// unpkg -> node_modules resolve hook must be preloaded into each child *before*
// its module graph is linked (unpkg specifiers are resolved during linking, so
// an in-file `import './register.mjs'` runs too late for statically-imported
// unpkg URLs). Passing the hook via `--import` in `execArgv` registers it in
// every child ahead of linking. A file:// URL keeps this correct on Windows,
// where a bare absolute path would be misread by `--import`.
const register = pathToFileURL(path.join(testDir, 'register.mjs')).href;

const stream = run({ files, execArgv: ['--import', register] });
stream.on('test:fail', () => {
    process.exitCode = 1;
});
stream.compose(new SpecReporter()).pipe(process.stdout);
