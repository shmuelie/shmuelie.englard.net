import gulp from 'gulp'
import { clean } from "./gulp/gulp-clean.mjs"
import { tsBuild } from './gulp/gulp-ts-build.mjs'
import { cssBuild } from './gulp/gulp-css-build.mjs'
import { htmlBuild } from './gulp/gulp-html-build.mjs'
import { copyStatic } from './gulp/gulp-copy-static.mjs'
import { generatePaths } from './gulp/gulp-generate-paths.mjs'

gulp.task("clean", clean);
gulp.task("ts-build", tsBuild);
gulp.task("css-build", cssBuild);
gulp.task("html-build", htmlBuild);
gulp.task("copy-static", copyStatic);
gulp.task("generate-paths", generatePaths);

gulp.task("build", gulp.series(["clean", "ts-build", "css-build", "html-build", "copy-static"]));