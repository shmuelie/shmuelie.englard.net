import gulp from 'gulp'
import { buildHtml, buildSass, buildTypeScriptProject, cleanBuildOutput, copyStatic, generatePaths } from './gulp/index.mjs'

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