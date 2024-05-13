import gulp from 'gulp'
import { buildHtml, buildSass, buildTypeScriptProject, cleanBuildOutput, copyStatic, generateNodeModulePathMappings, generateDropInBlogTypings } from './gulp/index.mjs'

gulp.task("clean", cleanBuildOutput);
gulp.task(buildTypeScriptProject);
gulp.task(buildSass);
gulp.task(buildHtml);
gulp.task(copyStatic);
gulp.task(generateNodeModulePathMappings);
gulp.task(generateDropInBlogTypings);

gulp.task("build", gulp.series([
    "clean",
    buildTypeScriptProject.name,
    buildSass.name,
    buildHtml.name,
    copyStatic.name
]));