import gulp from 'gulp'
import sourcemaps from 'gulp-sourcemaps'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'

const sass = gulpSass(dartSass);

/**
 * Compiles SASS, minifies it, and the copies it to the output folder.
 * @returns {NodeJS.ReadWriteStream}
 */
export function buildSass() {
    return gulp.src("src/*.scss").
        pipe(sourcemaps.init()).
        pipe(sass({
            outputStyle: 'compressed',
            importer: function (url) {
                return {
                    file: url.replace("~", "./node_modules/")
                };
            }
        })).
        pipe(sourcemaps.write(".")).
        pipe(gulp.dest("dist"));
}