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
