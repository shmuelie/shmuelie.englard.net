import gulp from 'gulp'

/**
 * Copies static items to build output.
 * @returns {NodeJS.ReadWriteStream}
 */
export function copyStatic() {
    return gulp.src("www/*.*").pipe(gulp.dest("dist"));
}