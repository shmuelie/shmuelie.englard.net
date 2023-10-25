# Personal Site

Source code for [shmuelie.englard.net](https://shmuelie.englard.net/).

## Runtime Dependencies

All libraries are loaded from CDN in production and from NPM for development.
This means that runtime dependencies are listed under development dependencies
in `project.json`.

- [microdata-tooling](https://shmuelie.github.io/microdata-tooling/) version 1.0.4
- [shieldsio-elements](https://shmuelie.github.io/shieldsio-elements/) version 1.0.0
- [hashed-es6](https://shmuelie.github.io/hashed-es6/) version 1.0.2
- [Fluent UI](https://developer.microsoft.com/en-us/fluentui#/) version 2.5.16

## Development

The website uses [gulp](https://gulpjs.com/) for building the website.
[Typescript](https://www.typescriptlang.org/) is used for writing JavaScript.
Fluent UI is used for design. JavaScript and CSS are minimized before
deployment. HTML is currently not minimized.
