import gulp from 'gulp'
import ts from 'gulp-typescript'
import sourcemaps from 'gulp-sourcemaps'
import terser from 'gulp-terser'
import fs from 'fs'
import { deleteAsync } from 'del'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'

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

// Copy HTML to build folder.
gulp.task("html-build", function () {
    return gulp.src("src/*.htm").
           pipe(sourcemaps.init()).
           //pipe(htmlmin()).
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
