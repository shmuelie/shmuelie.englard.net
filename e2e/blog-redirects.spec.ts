import { test, expect } from '@playwright/test';
import { installMocks } from './support/mock';

// Both the shareable static article URL and the RSS feed's /blog/?p=<slug> entry
// must bounce visitors into the interactive single-page view at /?p=<slug>.
test('static /blog/<slug>/ redirects to the interactive /?p=<slug> view', async ({ page }) => {
    await installMocks(page);

    await page.goto('/blog/hello-world/');
    await page.waitForURL((url) => url.pathname === '/' && url.searchParams.get('p') === 'hello-world');

    await expect(page.locator('blog-element .blog-post h1')).toContainText('Hello World');
});

test('RSS entry /blog/?p=<slug> redirects to the interactive /?p=<slug> view', async ({ page }) => {
    await installMocks(page);

    await page.goto('/blog/?p=second-post');
    await page.waitForURL((url) => url.pathname === '/' && url.searchParams.get('p') === 'second-post');

    await expect(page.locator('blog-element .blog-post h1')).toContainText('Second Post');
});

// Crawlers and social unfurlers fetch the static page without running JS, so the
// Open Graph tags and article body must be present in the served HTML directly.
test('static /blog/<slug>/ serves Open Graph tags + article content without JS', async ({ request }) => {
    const response = await request.get('/blog/hello-world/');
    expect(response.ok()).toBeTruthy();

    const html = await response.text();
    expect(html).toContain('<meta property="og:title" content="Hello World" />');
    expect(html).toContain('<meta property="og:type" content="article" />');
    expect(html).toContain('rel="canonical" href="https://shmuelie.englard.net/blog/hello-world/"');
    expect(html).toContain('itemtype="https://schema.org/BlogPosting"');
    expect(html).toContain('Welcome to the blog');
});

// Defense in depth: the generated static page ships a Content-Security-Policy
// that only allows our own inline scripts (by hash) and re-emits CMS structured
// data in a single controlled ld+json block.
test('static /blog/<slug>/ ships a hash-based CSP and controlled structured data', async ({ request }) => {
    const response = await request.get('/blog/hello-world/');
    const html = await response.text();

    const csp = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"/);
    expect(csp, 'expected a CSP meta tag').not.toBeNull();
    const policy = csp![1];
    expect(policy).toContain("object-src 'none'");
    expect(policy).toMatch(/script-src [^;]*'sha256-/);
    // Scripts must not be allowed via 'unsafe-inline' — only by hash.
    expect(policy).not.toMatch(/script-src[^;]*'unsafe-inline'/);

    // The CMS schema is re-emitted as exactly one application/ld+json block.
    expect(html.match(/type="application\/ld\+json"/g)?.length).toBe(1);
    expect(html).toContain('"@type":"BlogPosting"');
});

// A compromised CMS (or a future comments/guest-author feature) must not be able
// to inject executable markup into the shareable static pages.
test('static /blog/<slug>/ sanitizes hostile CMS HTML', async ({ request }) => {
    const response = await request.get('/blog/hostile-post/');
    expect(response.ok()).toBeTruthy();

    const html = await response.text();
    const body = html.match(/<div itemprop="articleBody">([\s\S]*?)<\/div>/)?.[1] ?? '';
    expect(body).toContain('trusted copy');
    expect(body).not.toContain('window.__xss');
    expect(body).not.toContain('onerror');
    expect(body).not.toContain('javascript:');
    // The schema breakout attempt yields invalid JSON, so no ld+json is emitted.
    expect(html).not.toContain('type="application/ld+json"');
});
