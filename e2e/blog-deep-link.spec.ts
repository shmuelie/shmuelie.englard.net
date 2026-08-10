import { test, expect } from '@playwright/test';
import { installMocks } from './support/mock';

// Deep-linking straight to a post (exercises the generation-guarded slug load in
// BlogElement plus index.ts's openBlogPostFromQuery).
test('deep-link /?p=<slug> opens the matching post in the SPA', async ({ page }) => {
    await installMocks(page);

    await page.goto('/?p=hello-world');

    const blog = page.locator('blog-element');
    await expect(blog.locator('.blog-post')).toBeVisible();
    await expect(blog.locator('.blog-post h1')).toContainText('Hello World');
    await expect(blog.locator('.blog-post article')).toContainText('Welcome to the blog');

    // The blog tab is activated and the deep-link URL is preserved.
    await expect(page.locator('wa-tab-panel[name="blog"]')).toBeVisible();
    expect(new URL(page.url()).searchParams.get('p')).toBe('hello-world');
});
