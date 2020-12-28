var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("ts-build", function () {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
});

var paths = {
    pages: ["www/*.htm", "www/*.css"]
};

gulp.task("copy-static", function () {
    return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});

gulp.task("build-Debug", gulp.series(["ts-build", "copy-static"]));