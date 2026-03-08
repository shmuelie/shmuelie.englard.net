# Personal Site

Source code for [shmuelie.englard.net](https://shmuelie.englard.net/).

## Runtime Dependencies

All runtime libraries load from [unpkg CDN](https://unpkg.com/) in production and from local `node_modules` during development. This means runtime dependencies are listed under `devDependencies` in `package.json`. Source code imports use full unpkg.com URLs (e.g., `https://unpkg.com/@microsoft/fast-element@1.14.0`), which are redirected to local packages at build time via `registerHooks()` in `gulp/index.mjs`.

- [shieldsio-elements](https://shmuelie.github.io/shieldsio-elements/)
- [hashed-es6](https://shmuelie.github.io/hashed-es6/)
- [Fluent UI](https://developer.microsoft.com/en-us/fluentui#/)

## Development

The website uses [gulp](https://gulpjs.com/) for building. [TypeScript](https://www.typescriptlang.org/) is used for writing JavaScript and [Sass](https://sass-lang.com/) for CSS. [Fluent UI](https://developer.microsoft.com/en-us/fluentui#/) is used for design. JavaScript and CSS are minified before deployment.

### Prerequisites

- [Node.js](https://nodejs.org/) (v23+)
- [pnpm](https://pnpm.io/)

### Commands

```sh
pnpm install   # Install dependencies (also generates tsconfig.paths.json)
pnpm build     # Build the site to dist/
pnpm run clean # Clean build output
pnpm run test-server # Serve dist/ on localhost:8000
```

## Deployment

The site is deployed to [GitHub Pages](https://pages.github.com/) automatically on push to `main` via a GitHub Actions workflow. The workflow builds the site and deploys the `dist/` directory using the `actions/deploy-pages` action.

> **Note:** The repository's GitHub Pages source must be set to **GitHub Actions** in Settings → Pages.
