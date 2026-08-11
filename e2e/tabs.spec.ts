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

// The Projects tab is rendered statically at build time from data/projects.mjs,
// so it should navigate like the other tabs and show at least one project card.
test('the Projects tab navigates and renders project cards', async ({ page }) => {
    await installMocks(page);
    await page.goto('/');
    await page.waitForFunction(() => !!customElements.get('wa-tab-group'));

    await page.locator('wa-tab[panel="projects"]').click();
    await expect(page.locator('wa-tab-panel[name="projects"]')).toBeVisible();
    await page.waitForFunction(() => location.hash === '#/rootTabs/projects');

    const cards = page.locator('wa-tab-panel[name="projects"] wa-card');
    expect(await cards.count()).toBeGreaterThan(0);
    await expect(cards.first().locator('h2')).not.toBeEmpty();
    await expect(cards.first().locator('a')).toHaveAttribute('href', /.+/);
});

test('a #/rootTabs/projects hash restores the Projects tab on load', async ({ page }) => {
    await installMocks(page);

    await page.goto('/#/rootTabs/projects');
    await page.waitForFunction(() => !!customElements.get('wa-tab-group'));

    await expect(page.locator('wa-tab-panel[name="projects"]')).toBeVisible();
    await expect(page.locator('wa-tab-panel[name="general"]')).toBeHidden();
});

// Regression guard: the tab body must scroll internally within the card, so a
// tall panel (like Projects) never spills past the card and forces the whole
// page to scroll. Uses a short viewport to guarantee the content overflows.
test('the Projects tab scrolls internally instead of overflowing the page', async ({ page }) => {
    await installMocks(page);
    await page.setViewportSize({ width: 800, height: 600 });

    await page.goto('/#/rootTabs/projects');
    await page.waitForFunction(() => !!customElements.get('wa-tab-group'));
    await expect(page.locator('wa-tab-panel[name="projects"]')).toBeVisible();

    const metrics = await page.evaluate(() => {
        const doc = document.documentElement;
        const tg = document.querySelector('wa-tab-group')!;
        const body = tg.shadowRoot!.querySelector('[part~="body"]')!;
        return {
            pageScrollH: doc.scrollHeight,
            pageClientH: doc.clientHeight,
            bodyScrollH: body.scrollHeight,
            bodyClientH: body.clientHeight,
        };
    });

    // The panel body is the scroll container: its content is taller than its box.
    expect(metrics.bodyScrollH).toBeGreaterThan(metrics.bodyClientH);
    // The page itself does not scroll (allow a few px for the body margin).
    expect(metrics.pageScrollH).toBeLessThanOrEqual(metrics.pageClientH + 20);
});
