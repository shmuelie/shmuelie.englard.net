import ts from 'gulp-typescript'
import sourcemaps from 'gulp-sourcemaps'
import terser from 'gulp-terser'
import gulp from 'gulp'

const tsProject = ts.createProject("tsconfig.json");

/**
 * Compiles and minimizes TypeScript, then copies to output folder.
 * @returns {NodeJS.ReadWriteStream}
 */
export function buildTypeScriptProject() {
    return tsProject.src().
        pipe(sourcemaps.init()).
        pipe(tsProject()).js.
        pipe(terser()).
        pipe(sourcemaps.write(".")).
        pipe(gulp.dest("dist"));
}