import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { BrowserContext, Page } from '@playwright/test';

/** The subset of DropInBlog post fields used by the site and these fixtures. */
export interface FixturePost {
    id: number;
    slug: string;
    title: string;
    summary: string;
    seoDescription: string;
    featuredImage: string;
    publishedAt: string;
    publishedAtIso8601: string;
    content: string;
    schema_article: string;
}

/** Absolute path to the shared blog fixture consumed by the build and the tests. */
export const FIXTURE_PATH = path.resolve('e2e/fixtures/posts.json');

/** Load the shared fixture posts (the same data the fixture build renders). */
export function loadFixturePosts(): FixturePost[] {
    return JSON.parse(readFileSync(FIXTURE_PATH, 'utf-8')) as FixturePost[];
}

function apiEnvelope<T>(data: T) {
    return { success: true, code: 200, locale: 'en_US', message: '', data };
}

/**
 * The app fetches the DropInBlog API cross-origin, so the mocked responses need
 * `access-control-allow-origin` to pass the browser's CORS checks.
 */
function jsonResponse<T>(data: T) {
    return { headers: { 'access-control-allow-origin': '*' }, json: apiEnvelope(data) };
}

/**
 * Stand in for the DropInBlog v2 API so the single-page blog element resolves
 * deterministically without touching the network. Handles the three endpoints
 * the site calls: post list, post-by-id, and post-by-slug.
 */
export async function mockBlogApi(target: Page | BrowserContext): Promise<void> {
    const posts = loadFixturePosts();

    await target.route('https://api.dropinblog.com/**', async (route) => {
        const { pathname } = new URL(route.request().url());

        const slugMatch = pathname.match(/\/posts\/slug\/([^/]+)$/);
        if (slugMatch) {
            const post = posts.find((p) => p.slug === decodeURIComponent(slugMatch[1])) ?? null;
            await route.fulfill(jsonResponse({ post }));
            return;
        }

        const idMatch = pathname.match(/\/posts\/(\d+)$/);
        if (idMatch) {
            const post = posts.find((p) => p.id === Number(idMatch[1])) ?? null;
            await route.fulfill(jsonResponse({ post }));
            return;
        }

        if (/\/posts$/.test(pathname)) {
            await route.fulfill(jsonResponse({
                posts,
                pagination: { total: posts.length, per_page: 10, current_page: 0, last_page: 0 }
            }));
            return;
        }

        await route.fulfill(jsonResponse({}));
    });
}
