import gulp from 'gulp'
import { clean } from "./gulp/clean.mjs"
import { tsBuild } from './gulp/tsBuild.mjs'
import { cssBuild } from './gulp/cssBuild.mjs'
import { htmlBuild } from './gulp/htmlBuild.mjs'
import { copyStatic } from './gulp/copyStatic.mjs'
import { generatePaths } from './gulp/generatePaths.mjs'

gulp.task("clean", clean);
gulp.task("ts-build", tsBuild);
gulp.task("css-build", cssBuild);
gulp.task("html-build", htmlBuild);
gulp.task("copy-static", copyStatic);
gulp.task("generate-paths", generatePaths);

gulp.task("build", gulp.series(["clean", "ts-build", "css-build", "html-build", "copy-static"]));