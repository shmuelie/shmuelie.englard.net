import type { BrowserContext, Page } from '@playwright/test';
import { mockBlogApi } from './blog-api';
import { routeUnpkg } from './unpkg';

// 1x1 transparent PNG used to satisfy image requests to third-party hosts
// (avatar, shields.io badges, blog featured images) without hitting the network.
const TRANSPARENT_PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
);

// Third-party image hosts referenced by the static markup and blog content.
const IMAGE_HOSTS = [
    'https://img.shields.io/**',
    'https://avatars0.githubusercontent.com/**',
    'https://avatars.githubusercontent.com/**',
    'https://dropinblog.net/**',
    'https://io.dropinblog.com/**'
];

/** Serve a transparent PNG for every third-party image host. */
async function stubImages(target: Page | BrowserContext): Promise<void> {
    for (const host of IMAGE_HOSTS) {
        await target.route(host, (route) =>
            route.fulfill({ status: 200, contentType: 'image/png', body: TRANSPARENT_PNG })
        );
    }
}

/**
 * Wire up all network mocks a page needs: unpkg assets served from local
 * node_modules, the DropInBlog API served from fixtures, and third-party images
 * stubbed out. After this, a page only depends on the local `dist/` server.
 */
export async function installMocks(target: Page | BrowserContext): Promise<void> {
    await routeUnpkg(target);
    await mockBlogApi(target);
    await stubImages(target);
}

/**
 * Start collecting uncaught page errors and `console.error` messages. Returns an
 * accessor for the accumulated messages so tests can assert the page loaded the
 * import-map modules (lit + Web Awesome) without failing.
 */
export function collectPageErrors(page: Page): () => string[] {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
        if (message.type() === 'error') {
            errors.push(`console.error: ${message.text()}`);
        }
    });
    return () => errors;
}
