# Personal Site

Source code for [shmuelie.englard.net](https://shmuelie.englard.net/).

## Runtime Dependencies

All libraries are loaded from CDN in production and from NPM for development.
This means that runtime dependencies are listed under development dependencies
in `package.json`.

- [shieldsio-elements](https://shmuelie.github.io/shieldsio-elements/)
- [hashed-es6](https://shmuelie.github.io/hashed-es6/)
- [Fluent UI](https://developer.microsoft.com/en-us/fluentui#/)

## Development

The website uses [gulp](https://gulpjs.com/) for building. [TypeScript](https://www.typescriptlang.org/) is used for writing JavaScript and [Sass](https://sass-lang.com/) for CSS. [Fluent UI](https://developer.microsoft.com/en-us/fluentui#/) is used for design. JavaScript and CSS are minified before deployment.

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Commands

```sh
pnpm install   # Install dependencies (also generates tsconfig.paths.json)
pnpm build     # Build the site to dist/
pnpm run clean # Clean build output
pnpm run test-server # Serve dist/ on localhost:8000
```
