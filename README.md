# Personal Site

Source code for [shmuelie.englard.net](https://shmuelie.englard.net/).

## Runtime Dependencies

All runtime libraries load from [unpkg CDN](https://unpkg.com/) in production and from local `node_modules` during development. This means runtime dependencies are listed under `devDependencies` in `package.json`. Source code imports use full unpkg.com URLs (e.g., `https://unpkg.com/lit@3.3.2/index.js`), which are redirected to local packages at build time via `registerHooks()` in `gulp/index.mts`.

- [shieldsio-elements](https://shmuelie.github.io/shieldsio-elements/)
- [hashed-es6](https://shmuelie.github.io/hashed-es6/)
- [Web Awesome](https://webawesome.com/) — UI components
- [Lit](https://lit.dev/) — base library for the custom blog component
- [DOMPurify](https://github.com/cure53/DOMPurify) — sanitizes CMS HTML before it is injected into the page

## Development

The website uses [gulp](https://gulpjs.com/) for building. [TypeScript](https://www.typescriptlang.org/) is used for writing JavaScript and [Sass](https://sass-lang.com/) for CSS. [Web Awesome](https://webawesome.com/) is used for design. JavaScript and CSS are minified before deployment.

### Prerequisites

- [Node.js](https://nodejs.org/) (v23+)
- [pnpm](https://pnpm.io/)

### Commands

```sh
pnpm install   # Install dependencies (also generates tsconfig.paths.json)
pnpm build     # Build the site to dist/
pnpm run clean # Clean build output
pnpm run test-server # Serve dist/ on localhost:8000
pnpm test      # Run the unit / component tests (jsdom)
```

### Testing

Unit and component tests run under Node's test runner against jsdom:

```sh
pnpm test
```

End-to-end tests use [Playwright](https://playwright.dev/) to drive a real
browser against a locally-served `dist/` build (real Web Awesome + Lit assets,
unlike the jsdom component tests). They build a deterministic `dist/` from a blog
fixture (`e2e/fixtures/posts.json` via the `BLOG_FIXTURE` env var) and mock the
DropInBlog API and unpkg CDN, so they need no network access. They cover the
behaviors most prone to regress: clean console load, dark-mode token flipping,
blog deep-linking, the static share / RSS redirects, the no-JS static article
pages, and tab + hash navigation.

```sh
pnpm exec playwright install chromium # One-time browser download
pnpm run test:e2e
```

E2E tests run as a standalone GitHub Actions workflow (on demand and on pull
requests) rather than in the deploy pipeline, keeping deploys fast.

## Deployment

The site is deployed to [GitHub Pages](https://pages.github.com/) automatically on push to `main` via a GitHub Actions workflow. The workflow builds the site and deploys the `dist/` directory using the `actions/deploy-pages` action.

> **Note:** The repository's GitHub Pages source must be set to **GitHub Actions** in Settings → Pages.
