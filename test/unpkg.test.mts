import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { resolve } from '../unpkg.mjs';

type NextResolver = (specifier: string, context: object) => { url: string; shortCircuit?: boolean };

const context = { conditions: [], importAttributes: {} };
const failingNext: NextResolver = () => {
    throw new Error('nextResolve should not be called for unpkg.com specifiers');
};

function expectedUrl(...parts: string[]): string {
    return 'file://' + path.join(process.cwd(), 'node_modules', ...parts);
}

test('maps a simple unpkg package URL to node_modules', () => {
    const result = resolve('https://unpkg.com/lit@3.3.2/index.js', context, failingNext);
    assert.equal(result.shortCircuit, true);
    assert.equal(result.url, expectedUrl('lit', 'index.js'));
});

test('maps a scoped package with a nested subpath', () => {
    const result = resolve('https://unpkg.com/@awesome.me/webawesome@3.5.0/dist/components/tab/tab.js', context, failingNext);
    assert.equal(result.url, expectedUrl('@awesome.me', 'webawesome', 'dist', 'components', 'tab', 'tab.js'));
});

test('maps a package URL with no subpath to the package root', () => {
    const result = resolve('https://unpkg.com/hashed-es6@1.0.3', context, failingNext);
    assert.equal(result.url, expectedUrl('hashed-es6'));
});

test('supports prerelease version suffixes', () => {
    const result = resolve('https://unpkg.com/lit@3.3.2-pre.1/index.js', context, failingNext);
    assert.equal(result.url, expectedUrl('lit', 'index.js'));
});

test('matches http as well as https', () => {
    const result = resolve('http://unpkg.com/lit@3.3.2/index.js', context, failingNext);
    assert.equal(result.url, expectedUrl('lit', 'index.js'));
});

test('delegates non-unpkg specifiers to the next resolver', () => {
    const sentinel = { url: 'file:///somewhere/else.js', shortCircuit: true };
    const result = resolve('./local-module.js', context, () => sentinel);
    assert.equal(result, sentinel);
});
