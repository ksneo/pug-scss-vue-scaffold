import gulp from 'gulp';
import gulpLoaderPlugins from 'gulp-load-plugins';
import { paths } from './settings';

const $ = gulpLoaderPlugins();

gulp.task('copy:bundle', cb => {
    // copy bundles to static
    gulp.src([`${paths.src.bundles}/*/**`, `${paths.src.bundles}/*`])
        .pipe($.changed(paths.dist.bundles))
        .pipe(gulp.dest(paths.dist.bundles));
    cb();
});
