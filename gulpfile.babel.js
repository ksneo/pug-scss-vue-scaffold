// @ts-nocheck
/* eslint-disable no-console */
import gulp from 'gulp';
import del from 'del';

import browserSyncTool from 'browser-sync';
import RevAll from 'gulp-rev-all';
import './build_scripts/build-html';
import './build_scripts/build-css';
import './build_scripts/build-static';
import './build_scripts/build-webpack';
import './build_scripts/build-img';
import './build_scripts/copy-bundle';
import { root, paths, resource, buildSettings } from './build_scripts/settings';

const browserSync = browserSyncTool.create('sync');

// clean dist
gulp.task('clean', cb => {
    del.sync([`${paths.dist.static}/*`, `${paths.dist.root}/*`], {
        force: true
    });

    cb();
});

// build for developer
gulp.task(
    'build',
    gulp.series(
        'clean',
        gulp.parallel(
            'build:html',
            'build:sass',
            'build:webpack',
            'build:static'
        )
    )
);

// production option
gulp.task('production', cb => {
    process.env.NODE_ENV = 'production';
    cb();
});

// append Resource Revision
gulp.task('revision:clean', () => del.sync([root.tmp], { force: true }));

gulp.task('revision:append', () =>
    gulp
        .src(`${paths.dist.root}/**/*`)
        .pipe(
            RevAll.revision({ dontRenameFile: [/^\/favicon.ico$/g, '.html'] })
        )
        .pipe(gulp.dest(root.tmp))
);

gulp.task('revision:copy', () =>
    gulp.src(`${root.tmp}/**/*`).pipe(gulp.dest(paths.dist.root))
);

// support Resource Revision
gulp.task(
    'revision',
    gulp.series(
        'revision:clean',
        'revision:append',
        'clean',
        'revision:copy',
        'revision:clean'
    )
);

// build production
gulp.task('build-prod', gulp.series('production', 'build'));

// build productions with revision
gulp.task('build-prod-revision', gulp.series('build-prod', 'revision'));

// run Development Web Server (BrowserSync) [localhost:3000]
gulp.task('server', cb => {
    // in this project we doesn't need in Browsersync
    let browserSyncConfig = {};

    if (buildSettings?.browserSync?.server) {
        browserSyncConfig = {
            open: false,
            server: { baseDir: paths.dist.root },
            notify: false
        };
    } else {
        browserSyncConfig = {
            open: false,
            proxy: buildSettings?.browserSync?.proxy,
            notify: false
        };
    }

    browserSync.init(browserSyncConfig);

    // watch for source
    function errorHandler(err) {
        console.log(err.toString());
    }

    gulp.watch(
        [...resource.src.htmlSrc, ...resource.src.pugSrc],
        gulp.series('build:html')
    ).on('error', errorHandler);

    gulp.watch(resource.src.sass, gulp.series('build:sass')).on(
        'error',
        errorHandler
    );

    gulp.watch(resource.src.static, gulp.series('build:static')).on(
        'error',
        errorHandler
    );
    cb();
});

// build and watch for developer
gulp.task('default', gulp.series(['build', 'copy:bundle', 'server']));
