import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import jsdomGlobal from 'jsdom-global';
import { parsePostSlug, openBlogPostFromQuery } from '../src/index-helpers.js';

let cleanup: (() => void) | undefined;

beforeEach(() => {
    cleanup = jsdomGlobal(undefined, { url: 'https://example.com/' });
});

afterEach(() => {
    cleanup?.();
    cleanup = undefined;
});

test('parsePostSlug reads the `p` query parameter', () => {
    assert.equal(parsePostSlug('?p=my-post'), 'my-post');
    assert.equal(parsePostSlug('?foo=bar&p=other'), 'other');
});

test('parsePostSlug returns null when no `p` parameter is present', () => {
    assert.equal(parsePostSlug(''), null);
    assert.equal(parsePostSlug('?foo=bar'), null);
});

test('openBlogPostFromQuery activates the blog tab and sets current-slug', () => {
    const blogElement = document.createElement('blog-element');
    let activated = 0;

    const applied = openBlogPostFromQuery('?p=hello-world', blogElement, () => { activated++; });

    assert.equal(applied, 'hello-world');
    assert.equal(activated, 1);
    assert.equal(blogElement.getAttribute('current-slug'), 'hello-world');
});

test('openBlogPostFromQuery does nothing without a slug', () => {
    const blogElement = document.createElement('blog-element');
    let activated = 0;

    const applied = openBlogPostFromQuery('?foo=bar', blogElement, () => { activated++; });

    assert.equal(applied, null);
    assert.equal(activated, 0);
    assert.equal(blogElement.getAttribute('current-slug'), null);
});

test('openBlogPostFromQuery does nothing when there is no blog element', () => {
    let activated = 0;

    const applied = openBlogPostFromQuery('?p=hello', null, () => { activated++; });

    assert.equal(applied, null);
    assert.equal(activated, 0);
});
