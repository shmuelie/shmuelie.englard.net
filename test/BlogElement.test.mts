import { describe, it, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import * as nodeModule from 'node:module';
import jsdomGlobal from 'jsdom-global';
// Registering the unpkg resolve hook lets us import `BlogElement`, which pulls
// Lit in via unpkg.com URLs, and map it to local node_modules.
import './register.mjs';

// These component tests exercise the real Lit element under jsdom. They require
// the synchronous `module.registerHooks` API (used by ./register.mjs, available
// on Node 22.15+/23+) so that the unpkg.com imports inside `BlogElement`/Lit
// resolve to local packages. On older runtimes the resolve hook is a no-op and
// importing the element would fail, so the suite is skipped rather than reported
// as failing.
const componentTestsSupported =
    typeof (nodeModule as { registerHooks?: unknown }).registerHooks === 'function';

interface Deferred<T> {
    promise: Promise<T>;
    resolve: (value: T) => void;
}

function deferred<T>(): Deferred<T> {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((res) => { resolve = res; });
    return { promise, resolve };
}

function delay(ms: number): Promise<void> {
    return new Promise((res) => setTimeout(res, ms));
}

// Poll (yielding to hashed-es6's 0ms debounce timer via `delay(0)`) until the
// location hash matches `expected`, up to a bounded number of retries. This is
// deterministic under load/CI, unlike waiting a fixed, guessed duration.
async function waitForHash(expected: string, retries = 50): Promise<void> {
    for (let i = 0; i < retries && window.location.hash !== expected; i++) {
        await delay(0);
    }
}

// Resolves the next time the element dispatches its `change` event, which the
// element fires whenever a load (list, single post, or slug resolution) settles.
function nextChange(element: EventTarget): Promise<void> {
    return new Promise((res) => element.addEventListener('change', () => res(), { once: true }));
}

type JsonResponse = { json: () => Promise<unknown> };
type Route = (url: URL) => unknown | Promise<unknown>;

// Minimal structural view of the `blog-element` (a LitElement) used by the
// tests. Narrowing to this instead of `any` catches assertion mismatches at
// compile time. `shadowRoot` is always present because Lit renders into one.
interface BlogElementLike extends HTMLElement {
    shadowRoot: ShadowRoot;
    updateComplete: Promise<boolean>;
    currentPost: number | null;
    currentPage: number | null;
}

describe('BlogElement (component)', { skip: !componentTestsSupported }, () => {
    let hashed: { reset: () => void };
    let originalFetch: typeof globalThis.fetch;
    let cleanupDom: (() => void) | undefined;
    let elementIdCounter = 0;
    let connected: BlogElementLike[] = [];

    // Per-test routing table for the mocked DropInBlog API.
    let routes: {
        posts?: Route;
        post?: Route;
        slug?: Route;
    } = {};

    before(async () => {
        cleanupDom = jsdomGlobal(undefined, { url: 'https://example.com/' });
        // jsdom exposes customElements on `window` but jsdom-global does not copy
        // it onto the global scope that Lit's `@customElement` decorator reads.
        (globalThis as { customElements?: unknown }).customElements = window.customElements;
        // Import after the DOM and resolve hook are in place so Lit can register.
        await import('../src/blog/BlogElement.js');
        hashed = await import('https://unpkg.com/hashed-es6@1.0.3') as { reset: () => void };
    });

    beforeEach(async () => {
        // Start every test from a clean hash/provider state. Clear the hash
        // *before* reset() so the new store is not seeded from a previous test's
        // (possibly debounced) hash write.
        //
        // jsdom fires `popstate` *asynchronously* when `location.hash` is
        // assigned (a divergence from real browsers). Clearing a leftover hash
        // here therefore queues a popstate that would otherwise land in the
        // middle of the next test and drive hashed-es6 -> hashUpdated -> _load,
        // clobbering whatever the test just loaded. Flush it now, before any
        // element (and hence any hashed provider) exists, so it is harmless.
        const hadHash = window.location.hash !== '';
        window.location.hash = '';
        hashed.reset();
        if (hadHash) {
            // Let the queued (spurious) popstate fire against the freshly reset,
            // provider-less store, where it is a no-op.
            await delay(0);
        }
        routes = {};
        connected = [];
        originalFetch = globalThis.fetch;
        globalThis.fetch = (async (input: unknown): Promise<JsonResponse> => {
            const url = new URL(String(input));
            const path = url.pathname;
            let route: Route | undefined;
            if (/\/posts\/slug\//.test(path)) {
                route = routes.slug;
            } else if (/\/posts\/\d+$/.test(path)) {
                route = routes.post;
            } else if (/\/posts$/.test(path)) {
                route = routes.posts;
            }
            const payload = route
                ? await route(url)
                : { success: false, code: 404, message: 'not found', data: null };
            return { json: async () => payload };
        }) as unknown as typeof globalThis.fetch;
    });

    afterEach(async () => {
        // Disconnect the elements so no further reactivity runs after the test.
        for (const element of connected) {
            element.remove();
        }
        connected = [];
        globalThis.fetch = originalFetch;
        // Drain the debounced hash-update timers scheduled by hashed-es6 so they
        // do not leak into the next test.
        await delay(0);
    });

    after(() => {
        cleanupDom?.();
    });

    // Creates and connects a fresh element. A unique id keeps hashed-es6 provider
    // keys from colliding across tests.
    async function createElement(id = `blog-${++elementIdCounter}`): Promise<BlogElementLike> {
        const element = document.createElement('blog-element') as BlogElementLike;
        element.id = id;
        document.body.appendChild(element);
        connected.push(element);
        await element.updateComplete;
        return element;
    }

    // Lit runs render() before updated(), and the element only flips `loading`
    // to true from within updated() -> _load(). Pump a few update cycles until
    // the loading state has rendered.
    async function waitForLoading(element: BlogElementLike): Promise<void> {
        for (let i = 0; i < 5 && section(element) !== 'blog-loading'; i++) {
            await element.updateComplete;
        }
    }

    // Connects the element and configures the API, waiting for the initial load.
    async function createConfiguredElement(id?: string): Promise<BlogElementLike> {
        const element = await createElement(id);
        const loaded = nextChange(element);
        element.setAttribute('blog-id', 'test-blog');
        element.setAttribute('oauth-key', 'test-key');
        await loaded;
        await element.updateComplete;
        return element;
    }

    function section(element: BlogElementLike): string | undefined {
        return element.shadowRoot?.querySelector('section')?.className;
    }

    it('renders the loading spinner while a load is in flight', async () => {
        const gate = deferred<unknown>();
        routes.posts = () => gate.promise;

        const element = await createElement();
        element.setAttribute('blog-id', 'test-blog');
        element.setAttribute('oauth-key', 'test-key');
        await waitForLoading(element);

        assert.equal(section(element), 'blog-loading');
        assert.ok(element.shadowRoot.querySelector('wa-spinner'), 'expected a spinner while loading');

        // Resolve and let the load settle so it doesn't dispatch after the test.
        const done = nextChange(element);
        gate.resolve({ success: true, code: 200, data: { posts: [], pagination: { last_page: 0 } } });
        await done;
        await element.updateComplete;
    });

    it('renders the post list from the API', async () => {
        routes.posts = () => ({
            success: true,
            code: 200,
            data: {
                posts: [
                    { id: 1, title: 'First', summary: 'One' },
                    { id: 2, title: 'Second', summary: 'Two' }
                ],
                pagination: { last_page: 1 }
            }
        });

        const element = await createConfiguredElement();

        assert.equal(section(element), 'blog-posts');
        assert.equal(element.shadowRoot.querySelectorAll('wa-card').length, 2);
    });

    it('renders the "No Posts" state when the API returns no posts', async () => {
        routes.posts = () => ({
            success: true,
            code: 200,
            data: { posts: [], pagination: { last_page: 0 } }
        });

        const element = await createConfiguredElement();

        assert.equal(section(element), 'no-posts');
    });

    it('renders a single post when current-post is set', async () => {
        routes.posts = () => ({
            success: true,
            code: 200,
            data: { posts: [{ id: 2, title: 'Second' }], pagination: { last_page: 1 } }
        });
        routes.post = (url) => {
            const id = Number(url.pathname.split('/').pop());
            return { success: true, code: 200, data: { post: { id, title: `Post ${id}`, content: '<p>body</p>' } } };
        };

        const element = await createConfiguredElement();

        const shown = nextChange(element);
        element.setAttribute('current-post', '2');
        await shown;
        await element.updateComplete;

        assert.equal(section(element), 'blog-post');
        assert.equal(element.shadowRoot.querySelector('h1 span:last-child')?.textContent, 'Post 2');
    });

    it('returns to the list when the back button clears current-post', async () => {
        routes.posts = () => ({
            success: true,
            code: 200,
            data: { posts: [{ id: 2, title: 'Second' }], pagination: { last_page: 1 } }
        });
        routes.post = () => ({ success: true, code: 200, data: { post: { id: 2, title: 'Second', content: '<p>b</p>' } } });

        const element = await createConfiguredElement();

        let shown = nextChange(element);
        element.setAttribute('current-post', '2');
        await shown;
        await element.updateComplete;
        assert.equal(section(element), 'blog-post');

        shown = nextChange(element);
        const backButton = element.shadowRoot.querySelector<HTMLElement>('.back-button');
        assert.ok(backButton, 'expected a back button on the open post');
        backButton.click();
        await shown;
        await element.updateComplete;

        assert.equal(section(element), 'blog-posts');
        assert.equal(element.currentPost, null);
    });

    it('resolves current-slug via getPostBySlug and reflects the post id in the hash', async () => {
        routes.posts = () => ({ success: true, code: 200, data: { posts: [], pagination: { last_page: 1 } } });
        routes.slug = (url) => {
            const slug = decodeURIComponent(url.pathname.split('/').pop() ?? '');
            return { success: true, code: 200, data: { post: { id: 77, slug, title: 'Slugged', content: '<p>s</p>' } } };
        };

        // The id drives the hash key: `<id>Post` -> `theblogPost`.
        const element = await createConfiguredElement('theblog');

        const resolved = nextChange(element);
        element.setAttribute('current-slug', 'my-post');
        await resolved;
        await element.updateComplete;

        assert.equal(section(element), 'blog-post');
        assert.equal(element.currentPost, 77);

        // hashed-es6 writes the hash on a debounced 0ms timer; poll until it
        // lands rather than guessing a fixed delay.
        await waitForHash('#/theblogPost/77');
        assert.equal(window.location.hash, '#/theblogPost/77');
    });

    it('updates current-page and reloads when paginating', async () => {
        routes.posts = (url) => {
            const page = Number(url.searchParams.get('page') ?? '0');
            return {
                success: true,
                code: 200,
                data: { posts: [{ id: page * 10, title: `Page ${page}` }], pagination: { last_page: 3 } }
            };
        };

        const element = await createConfiguredElement();

        const buttons = () => element.shadowRoot.querySelectorAll<HTMLButtonElement>('.blog-pagination button');
        assert.equal(element.shadowRoot.querySelector('.blog-pagination span')?.textContent?.trim(), 'Page 1 of 3');
        assert.equal(buttons()[0].disabled, true, 'previous should be disabled on the first page');

        // Next
        let reloaded = nextChange(element);
        buttons()[1].click();
        await reloaded;
        await element.updateComplete;

        assert.equal(element.currentPage, 1);
        assert.equal(element.shadowRoot.querySelector('.blog-pagination span')?.textContent?.trim(), 'Page 2 of 3');

        // Previous
        reloaded = nextChange(element);
        buttons()[0].click();
        await reloaded;
        await element.updateComplete;

        assert.equal(element.currentPage, 0);
        assert.equal(element.shadowRoot.querySelector('.blog-pagination span')?.textContent?.trim(), 'Page 1 of 3');
    });

    it('does not let a slow post-list load clobber a newer post selection', async () => {
        // The list load is held open so it resolves *after* the post selection.
        const listGate = deferred<unknown>();
        routes.posts = () => listGate.promise;
        routes.post = (url) => {
            const id = Number(url.pathname.split('/').pop());
            return { success: true, code: 200, data: { post: { id, title: `Chosen ${id}`, content: '<p>c</p>' } } };
        };

        const element = await createElement();
        // Kick off the (stalled) list load.
        element.setAttribute('blog-id', 'test-blog');
        element.setAttribute('oauth-key', 'test-key');
        await waitForLoading(element);
        assert.equal(section(element), 'blog-loading');

        // Select a post while the list load is still in flight.
        const shown = nextChange(element);
        element.setAttribute('current-post', '5');
        await shown;
        await element.updateComplete;
        assert.equal(section(element), 'blog-post');
        assert.equal(element.currentPost, 5);

        // Now let the stale list load resolve; it must not overwrite the post.
        // A load that actually settles dispatches `change`; the generation guard
        // should drop this stale one, so poll (yielding to drain the queued
        // continuation) and assert no such event ever arrives, rather than
        // waiting a fixed, guessed duration.
        let staleSettled = false;
        element.addEventListener('change', () => { staleSettled = true; }, { once: true });
        listGate.resolve({
            success: true,
            code: 200,
            data: { posts: [{ id: 1, title: 'Stale' }], pagination: { last_page: 1 } }
        });
        for (let i = 0; i < 50 && !staleSettled; i++) {
            await delay(0);
        }
        await element.updateComplete;

        assert.equal(staleSettled, false, 'the stale list load must not settle and dispatch change');
        assert.equal(section(element), 'blog-post', 'the stale list load must not replace the open post');
        assert.equal(element.currentPost, 5);
    });
});
