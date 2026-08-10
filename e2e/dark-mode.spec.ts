import { test, expect, type Page } from '@playwright/test';
import { installMocks } from './support/mock';

// The four Web Awesome color tokens the site drives its theme from: body
// background, body text, links, and borders (see src/index.scss + partials).
function readThemeTokens(page: Page) {
    return page.evaluate(() => {
        const style = getComputedStyle(document.documentElement);
        return {
            surface: style.getPropertyValue('--wa-color-surface-default').trim(),
            text: style.getPropertyValue('--wa-color-text-normal').trim(),
            link: style.getPropertyValue('--wa-color-text-link').trim(),
            border: style.getPropertyValue('--wa-color-surface-border').trim()
        };
    });
}

test('.wa-dark / .wa-light toggle flips the Web Awesome color tokens', async ({ page }) => {
    await installMocks(page);

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/wa-dark/);
    const dark = await readThemeTokens(page);

    // Flipping the OS preference drives the inline theme script to swap classes.
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(page.locator('html')).toHaveClass(/wa-light/);
    const light = await readThemeTokens(page);

    // Every tracked token (background, text, links, borders) must actually change.
    expect(dark.surface).not.toEqual(light.surface);
    expect(dark.text).not.toEqual(light.text);
    expect(dark.link).not.toEqual(light.link);
    expect(dark.border).not.toEqual(light.border);
});
