import gulp from 'gulp'

/**
 * Copies static items to build output.
 */
export function copyStatic(): NodeJS.ReadWriteStream {
    return gulp.src("www/*.*").pipe(gulp.dest("dist"));
}