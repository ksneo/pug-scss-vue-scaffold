import gulp from 'gulp';
import gulpLoaderPlugins from 'gulp-load-plugins';
import browserSyncTool from 'browser-sync';
import initGetData from 'jade-get-data';
import { root, paths, resource } from './settings';
import getMarkDown from './get-markdown';

const getData = initGetData(paths.src.data);
const getMD = getMarkDown(paths.src.data);
const $ = gulpLoaderPlugins();

// compile Pug -> HTML
gulp.task('build:pug', cb => {
    const browserSync = browserSyncTool.get('sync');
    gulp.src(resource.src.html)
        .pipe($.plumber())
        .pipe($.pug({ basedir: root.src, locals: { getData, getMD } }))
        .pipe($.prettier({ parser: 'vue' }))
        .pipe(gulp.dest(paths.dist.root))
        .pipe(browserSync.stream());
    cb();
});
