import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Blog } from '../src/drop-in-blog/Blog.js';
import { ApiError } from '../src/drop-in-blog/ApiError.js';

const BLOG_ID = 'test-blog-id';
const OAUTH_KEY = 'test-oauth-key-123';

interface Recorded {
    url: string;
    init: { method?: string; headers?: Record<string, string> };
}

function mockFetch(payload: unknown): { recorded: Recorded[]; restore: () => void } {
    const recorded: Recorded[] = [];
    const original = globalThis.fetch;
    globalThis.fetch = (async (input: unknown, init: unknown) => {
        recorded.push({ url: String(input), init: (init ?? {}) as Recorded['init'] });
        return { json: async () => payload } as unknown as Response;
    }) as unknown as typeof globalThis.fetch;
    return {
        recorded,
        restore: () => { globalThis.fetch = original; }
    };
}

test('getPost requests posts/{id} and returns the post', async () => {
    const post = { id: 42, title: 'Hello' };
    const mock = mockFetch({ success: true, code: 200, data: { post } });
    try {
        const result = await new Blog(BLOG_ID, OAUTH_KEY).getPost(42);
        assert.equal(mock.recorded.length, 1);
        assert.equal(mock.recorded[0].url, `https://api.dropinblog.com/v2/blog/${BLOG_ID}/posts/42`);
        assert.deepEqual(result, post);
    } finally {
        mock.restore();
    }
});

test('getPostBySlug requests posts/slug/{slug}', async () => {
    const post = { id: 7, slug: 'my-post' };
    const mock = mockFetch({ success: true, data: { post } });
    try {
        const result = await new Blog(BLOG_ID, OAUTH_KEY).getPostBySlug('my-post');
        assert.equal(mock.recorded[0].url, `https://api.dropinblog.com/v2/blog/${BLOG_ID}/posts/slug/my-post`);
        assert.deepEqual(result, post);
    } finally {
        mock.restore();
    }
});

test('getPostBySlug URL-encodes the slug in the request path', async () => {
    const mock = mockFetch({ success: true, data: { post: null } });
    try {
        await new Blog(BLOG_ID, OAUTH_KEY).getPostBySlug('a b/c?d#e');
        // The slug must be encoded so it stays a single path segment and cannot
        // manipulate the request path (defense in depth).
        assert.equal(
            mock.recorded[0].url,
            `https://api.dropinblog.com/v2/blog/${BLOG_ID}/posts/slug/a%20b%2Fc%3Fd%23e`
        );
    } finally {
        mock.restore();
    }
});

test('getPosts serializes pagination parameters into the query string', async () => {
    const mock = mockFetch({ success: true, data: { pagination: { last_page: 3 }, posts: [] } });
    try {
        await new Blog(BLOG_ID, OAUTH_KEY).getPosts({ page: 2, limit: 5 });
        const url = new URL(mock.recorded[0].url);
        assert.equal(url.pathname, `/v2/blog/${BLOG_ID}/posts`);
        assert.equal(url.searchParams.get('page'), '2');
        assert.equal(url.searchParams.get('limit'), '5');
    } finally {
        mock.restore();
    }
});

test('sends an Authorization header derived from the OAuth key', async () => {
    const mock = mockFetch({ success: true, data: { post: {} } });
    try {
        await new Blog(BLOG_ID, OAUTH_KEY).getPost(1);
        const headers = mock.recorded[0].init.headers ?? {};
        assert.equal(headers.accept, 'application/json');
        assert.ok(
            String(headers.authorization).includes(OAUTH_KEY),
            'authorization header should include the OAuth key'
        );
    } finally {
        mock.restore();
    }
});

test('throws ApiError when the API reports failure', async () => {
    const mock = mockFetch({ success: false, code: 404, message: 'Not found', data: null });
    try {
        const blog = new Blog(BLOG_ID, OAUTH_KEY);
        await assert.rejects(
            () => blog.getPost(999),
            (error: unknown) => {
                assert.ok(error instanceof ApiError);
                const apiError = error as ApiError;
                assert.equal(apiError.code, 404);
                assert.equal(apiError.message, 'Not found');
                return true;
            }
        );
    } finally {
        mock.restore();
    }
});
