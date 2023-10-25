import gulp from 'gulp'
import ts from 'gulp-typescript'
import sourcemaps from 'gulp-sourcemaps'
import terser from 'gulp-terser'
import fs from 'fs'
import { deleteAsync } from 'del'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import KEYS from 'jsdom-global/keys.js'
import { gulpDom } from './gulp_jsdom.mjs'

// Load current project's typescript configuration.
const tsProject = ts.createProject("tsconfig.json");

const sass = gulpSass(dartSass);

// Clean build folder.
gulp.task("clean", function () {
    return deleteAsync("dist/*.*");
});

// Build Typescript, minimizing output javascript, and copy to build folder.
gulp.task("ts-build", function () {
    return tsProject.src().
           pipe(sourcemaps.init()).
           pipe(tsProject()).js.
           pipe(terser()).
           pipe(sourcemaps.write(".", {
               includeContent: false,
               sourceRoot: "../src"
           })).
           pipe(gulp.dest("dist"));
});

// Minimize CSS and copy to build folder
gulp.task("css-build", function () {
    return gulp.src("src/*.scss").
           pipe(sourcemaps.init()).
           pipe(sass({
               outputStyle: 'compressed',
               importer: function (url) {
                return { file: url.replace("~", "./node_modules/") };
               }
           })).
           pipe(sourcemaps.write(".", {
               includeContent: false,
               sourceRoot: "../src"
           })).
           pipe(gulp.dest("dist"));
});

/**
 * @typedef {import('./src/schema').ContactPoint} ContactPoint
 * @type {ContactPoint[]}
 */
var contactPoints = JSON.parse(fs.readFileSync("src/me.json"));
contactPoints.sort(function (a, b) {
    return a.contactType.localeCompare(b.contactType);
});

/**
 *
 * @param {import('jsdom').JSDOM} document
 * @param {import('jsdom').DOMWindow} window
 * @returns {Promise<string?>}
 */
async function renderHtml(document, window) {
    KEYS.forEach(function (key) {
        global[key] = window[key];
    });
    global['customElements'] = window.customElements;

    global.document = window.document;
    global.window = window;
    window.console = global.console;

    const apply = (await import('microdata-tooling')).apply;
    const icons = (await import('shieldsio-elements')).icons;

    /**
     * @type {import('microdata-tooling').ApplyOptions}
     */
    const contactOptions = {
        typeHelpers: {
            "ContactPoint": function (data, element) {
                /**
                 * @type {ContactPoint | null}
                 */
                const contact = data;
                if (contact && contact.contactType) {
                    /**
                     * @type {import('shieldsio-elements').SimpleIconBadge | import('shieldsio-elements').ShieldIOStaticBadge}
                     */
                    let widget;
                    if (icons[contact.contactType]) {
                        widget = document.createElement("simpleicon-badge");
                        widget.logo = contact.contactType;
                    } else {
                        widget = document.createElement("shieldio-badge");
                        widget.message = contact.contactType;
                    }
                    widget.badgeStyle = "for-the-badge";
                    const link = document.createElement("a");
                    link.target = "_blank";
                    link.style.textDecoration = "none";
                    link.href = contact.url || "";
                    link.rel = "me";
                    link.appendChild(widget);
                    element.appendChild(link);
                }

                return false;
            }
        }
    };

    apply(contactPoints, document.querySelector("section[itemprop=contactPoint]"), contactOptions);
    apply(contactPoints, document.querySelector("div[itemprop=contactPoint]"), contactOptions);
}

// Copy HTML to build folder.
gulp.task("html-build", function () {

    return gulp.src("src/*.htm").
           pipe(sourcemaps.init()).
           //pipe(htmlmin()).
           pipe(gulpDom(renderHtml)).
           pipe(sourcemaps.write(".", {
               includeContent: false,
               sourceRoot: "../src"
           })).
           pipe(gulp.dest("dist"));
});

// Copy static content to build folder.
gulp.task("copy-static", function () {
    return gulp.src("www/*.*").pipe(gulp.dest("dist"));
});

// Generate paths for typescript intellisense.
gulp.task("generate-paths", function (cb) {
    const pathsConfig = {
        compilerOptions: {
            paths: {}
        }
    }
    /**
     * @type {{devDependencies:{[k:string]:string}}}
     */
    const projectMetadata = JSON.parse(fs.readFileSync("package.json"));
    for (const devDependencyName of Object.keys(projectMetadata.devDependencies)) {
        const devDependencyVersion = projectMetadata.devDependencies[devDependencyName];
        const unpkgPath = "https://unpkg.com/" + devDependencyName + "@" + devDependencyVersion;
        const localPath = "./node_modules/" + devDependencyName;
        pathsConfig.compilerOptions.paths[unpkgPath] = [
            localPath
        ];
    }
    fs.writeFileSync("tsconfig.paths.json", JSON.stringify(pathsConfig));
    cb();
});

gulp.task("build", gulp.series(["clean", "ts-build", "css-build", "html-build", "copy-static"]));
