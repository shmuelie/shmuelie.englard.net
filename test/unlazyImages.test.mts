import { test } from 'node:test';
import assert from 'node:assert/strict';
import { unlazyImages } from '../gulp/unlazyImages.mjs';

test('unlazyImages moves data-lazy-load URL into src', () => {
    const html = '<img src="placeholder.gif" data-lazy-load="https://cdn.example.com/real.jpg" />';
    const result = unlazyImages(html);
    assert.match(result, /src="https:\/\/cdn\.example\.com\/real\.jpg"/);
    assert.doesNotMatch(result, /placeholder\.gif/);
});

test('unlazyImages adds src when the img has none', () => {
    const html = '<img data-lazy-load="https://cdn.example.com/real.jpg" />';
    const result = unlazyImages(html);
    assert.match(result, /<img src="https:\/\/cdn\.example\.com\/real\.jpg"/);
});

test('unlazyImages inserts URLs with $ patterns literally (no String.replace corruption)', () => {
    // Signed CDN/S3 URLs can contain `$` sequences that String.prototype.replace
    // would otherwise interpret specially ($&, $1, $`, $', $$).
    const url = "https://cdn.example.com/img.jpg?sig=$&$1$`$'$$end";
    const html = `<img src="placeholder.gif" data-lazy-load="${url}" />`;
    const result = unlazyImages(html);
    assert.ok(result.includes(`src="${url}"`), `expected literal src, got: ${result}`);
});

test('unlazyImages preserves $ patterns when the img has no existing src', () => {
    const url = 'https://cdn.example.com/img.jpg?sig=$$literal$&whole';
    const html = `<img data-lazy-load="${url}" alt="x" />`;
    const result = unlazyImages(html);
    assert.ok(result.includes(`<img src="${url}"`), `expected literal src, got: ${result}`);
});

test('unlazyImages leaves images without data-lazy-load untouched', () => {
    const html = '<img src="https://cdn.example.com/real.jpg" alt="x" />';
    assert.equal(unlazyImages(html), html);
});
