import gulp from 'gulp'
import gulpLoaderPlugins from 'gulp-load-plugins'
import browserSyncTool from 'browser-sync'
import {root, paths, resource} from './settings';

const $ = gulpLoaderPlugins()
const browserSync = browserSyncTool.create()

// compile Pug -> HTML
gulp.task('build:pug', () => {
    return gulp
        .src(resource.src.pug)
        .pipe($.plumber())
        .pipe($.pug({basedir: root.src}))
        // .pipe($.htmlhint()) .pipe($.htmlhint.reporter())
        .pipe($.jsbeautifier())
        .pipe(gulp.dest(paths.dist.root))
        .pipe(browserSync.stream())
})