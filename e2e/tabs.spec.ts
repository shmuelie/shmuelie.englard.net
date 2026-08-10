import { test, expect } from '@playwright/test';
import { installMocks } from './support/mock';

// Tab switching drives the URL hash (via hashed-es6), and that hash restores the
// active tab on a fresh load — the deep-linkable navigation the site relies on.
test('switching tabs updates the hash', async ({ page }) => {
    await installMocks(page);
    await page.goto('/');
    await page.waitForFunction(() => !!customElements.get('wa-tab-group'));

    await expect(page.locator('wa-tab-panel[name="general"]')).toBeVisible();

    await page.locator('wa-tab[panel="hardware"]').click();
    await expect(page.locator('wa-tab-panel[name="hardware"]')).toBeVisible();
    await page.waitForFunction(() => location.hash === '#/rootTabs/hardware');
});

test('a #/rootTabs/<tab> hash restores the active tab on load', async ({ page }) => {
    await installMocks(page);

    await page.goto('/#/rootTabs/hardware');
    await page.waitForFunction(() => !!customElements.get('wa-tab-group'));

    await expect(page.locator('wa-tab-panel[name="hardware"]')).toBeVisible();
    await expect(page.locator('wa-tab-panel[name="general"]')).toBeHidden();
});
