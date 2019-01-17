import gulp from 'gulp';
import gulpLoaderPlugins from 'gulp-load-plugins';
import browserSyncTool from 'browser-sync';
import { gulpSassError } from 'gulp-sass-error';
import { paths, resource } from './settings';

const $ = gulpLoaderPlugins();
const throwError = false;

// compile Sass -> CSS
gulp.task('build:sass', done => {
    const browserSync = browserSyncTool.get('sync');

    gulp.src(resource.src.sass)
        .pipe($.plumber())
        .pipe($.sass().on('error', gulpSassError(throwError)))
        .pipe($.concat('style.css'))
        .pipe($.pleeease())
        .pipe(gulp.dest(paths.dist.css))
        .pipe(browserSync.stream());
    done();
});
