import { run } from 'node:test';
import { spec as SpecReporter } from 'node:test/reporters';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

// Discover compiled test files. Using the programmatic runner (instead of the
// `node --test <dir>` CLI) keeps behavior identical across Node versions.
const testDir = path.resolve('.test-out/test');
const files = readdirSync(testDir)
    .filter((name) => name.endsWith('.test.mjs'))
    .map((name) => path.join(testDir, name));

const stream = run({ files });
stream.on('test:fail', () => {
    process.exitCode = 1;
});
stream.compose(new SpecReporter()).pipe(process.stdout);
