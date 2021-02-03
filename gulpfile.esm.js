import gulp from 'gulp'
import ts from 'gulp-typescript'
import sourcemaps from 'gulp-sourcemaps'
import terser from 'gulp-terser'
import del from 'del'

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
           pipe(gulp.dest("dist"));
});

gulp.task("html-build", function () {
    return gulp.src("src/*.htm").
           pipe(gulp.dest("dist"));
});

gulp.task("copy-static", function () {
    return gulp.src("www/*.*").pipe(gulp.dest("dist"));
});

gulp.task("build", gulp.series(["clean", "ts-build", "css-build", "html-build", "copy-static"]));