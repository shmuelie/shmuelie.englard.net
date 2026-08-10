import { test, expect } from '@playwright/test';
import { installMocks, collectPageErrors } from './support/mock';

// Regression guard for the import-map wiring: lit + Web Awesome must resolve and
// the custom elements must upgrade without any uncaught errors or console errors.
test('home page loads lit + Web Awesome with no console errors', async ({ page }) => {
    await installMocks(page);
    const errors = collectPageErrors(page);

    await page.goto('/');

    await page.waitForFunction(
        () => !!customElements.get('wa-tab-group') && !!customElements.get('blog-element')
    );
    await expect(page.locator('wa-tab-group')).toBeVisible();

    // Let the blog element settle its initial load (spinner -> content).
    await page.waitForFunction(() => {
        const el = document.querySelector('blog-element');
        return !!el?.shadowRoot && !el.shadowRoot.querySelector('.blog-loading');
    });

    expect(errors()).toEqual([]);
});
