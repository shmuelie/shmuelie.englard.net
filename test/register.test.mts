import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as nodeModule from 'node:module';

// This file deliberately does NOT import ./register.mjs. It verifies that
// test/run.mjs preloads the unpkg resolve hook into each test child process
// (via `--import`), so a plain `https://unpkg.com/...` import resolves to the
// local node_modules copy. If the preload were missing, this import would fail
// with an unresolved-specifier error.
//
// The resolve hook uses the synchronous `module.registerHooks` API (Node
// 22.15+/23+); on older runtimes it is a no-op, so the check is skipped rather
// than reported as failing (matching the rest of the suite).
const hookSupported =
    typeof (nodeModule as { registerHooks?: unknown }).registerHooks === 'function';

test('run.mjs preloads the unpkg resolve hook so unpkg.com imports resolve', { skip: !hookSupported }, async () => {
    const lit = await import('https://unpkg.com/lit@3.3.2/index.js') as { LitElement?: unknown };
    assert.equal(typeof lit.LitElement, 'function');
});
