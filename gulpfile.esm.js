import gulp from 'gulp'
import ts from 'gulp-typescript'
import sourcemaps from 'gulp-sourcemaps'
import terser from 'gulp-terser'
import del from 'del'
import cleanCSS from 'gulp-clean-css'
import fs from 'fs'

const tsProject = ts.createProject("tsconfig.json");

gulp.task("clean", function () {
    return del("dist/*.*");
});

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

gulp.task("css-build", function () {
    return gulp.src("src/*.css").
           pipe(sourcemaps.init()).
           pipe(cleanCSS()).
           pipe(sourcemaps.write(".", {
               includeContent: false,
               sourceRoot: "../src"
           })).
           pipe(gulp.dest("dist"));
});

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

gulp.task("copy-static", function () {
    return gulp.src("www/*.*").pipe(gulp.dest("dist"));
});

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
