import { defineConfig, devices } from '@playwright/test';
import { FIXTURE_PATH } from './e2e/support/blog-api';

const PORT = 8100;
const BASE_URL = `http://localhost:${PORT}`;

// The E2E suite runs against a real `dist/` build served locally. The build is
// driven by a deterministic blog fixture (BLOG_FIXTURE) so it needs no network
// and produces the same static pages every run.
export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI
        ? [['github'], ['list'], ['html', { open: 'never' }]]
        : 'list',
    use: {
        baseURL: BASE_URL,
        trace: 'on-first-retry'
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        }
    ],
    webServer: {
        command: `pnpm run build && pnpm exec http-server ./dist/ -p ${PORT} -e htm -c-1`,
        url: BASE_URL,
        // Always rebuild dist/ from the deterministic BLOG_FIXTURE rather than
        // reusing whatever might already be listening on the port, so runs never
        // depend on an unrelated server serving stale bytes.
        reuseExistingServer: false,
        timeout: 120_000,
        env: { BLOG_FIXTURE: FIXTURE_PATH }
    }
});
