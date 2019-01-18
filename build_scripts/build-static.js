import gulp from 'gulp';
import gulpLoaderPlugins from 'gulp-load-plugins';
import browserSyncTool from 'browser-sync';
import autoprefixer from 'autoprefixer';
import { paths, resource, production } from './settings';

const $ = gulpLoaderPlugins();

// copy Static Resource
gulp.task('build:static', cb => {
    const libjs = resource.vendor.js;
    const browserSync = browserSyncTool.get('sync');
    gulp.src(Object.keys(libjs).map(key => libjs[key]))
        .pipe($.concat('vendor.bundle.js'))
        .pipe($.if(production(), $.uglify()))
        .pipe(gulp.dest(paths.dist.js));

    if (resource.vendor.css && resource.vendor.css.length > 0) {
        gulp.src(resource.vendor.css)
            .pipe($.concat('vendor.css'))
            .pipe($.postcss([autoprefixer()]))
            .pipe(gulp.dest(paths.dist.css));
    }

    gulp.src(resource.src.static)
        .pipe($.changed(paths.dist.root))
        .pipe(gulp.dest(paths.dist.root))
        .pipe(browserSync.stream());
    cb();
});
