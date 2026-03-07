import gulp from 'gulp'
import sourcemaps from 'gulp-sourcemaps'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import path from 'path'
import { pathToFileURL } from 'url'

const sass = gulpSass(dartSass);

const tildeImporter = {
    findFileUrl(url) {
        if (!url.startsWith('~')) {
            return null;
        }
        return pathToFileURL(path.resolve('./node_modules/', url.substring(1)));
    }
};

/**
 * Compiles SASS, minifies it, and the copies it to the output folder.
 * @returns {NodeJS.ReadWriteStream}
 */
export function buildSass() {
    return gulp.src("src/*.scss").
        pipe(sourcemaps.init()).
        pipe(sass({
            style: 'compressed',
            importers: [tildeImporter]
        })).
        pipe(sourcemaps.write(".")).
        pipe(gulp.dest("dist"));
}