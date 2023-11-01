import gulp from 'gulp'
import { cleanBuildOutput } from "./gulp/cleanBuildOutput.mjs"
import { buildTypeScriptProject } from './gulp/buildTypeScriptProject.mjs'
import { buildSass } from './gulp/buildSass.mjs'
import { buildHtml } from './gulp/buildHtml.mjs'
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