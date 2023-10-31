import gulp from 'gulp'
import { cleanBuildOutput } from "./gulp/clean.mjs"
import { buildTypeScriptProject } from './gulp/tsBuild.mjs'
import { buildSass } from './gulp/cssBuild.mjs'
import { buildHtml } from './gulp/htmlBuild.mjs'
import { copyStatic } from './gulp/copyStatic.mjs'
import { generatePaths } from './gulp/generatePaths.mjs'

gulp.task("clean", cleanBuildOutput);
gulp.task(buildTypeScriptProject);
gulp.task(buildSass);
gulp.task(buildHtml);
gulp.task("copy-static", copyStatic);
gulp.task("generate-paths", generatePaths);

gulp.task("build", gulp.series([
    "clean",
    buildTypeScriptProject.name,
    buildSass.name,
    buildHtml.name,
    "copy-static"
]));