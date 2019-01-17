import gulp from 'gulp';
import del from 'del';

import browserSyncTool from 'browser-sync';
import RevAll from 'gulp-rev-all';
import './build_scripts/build-pug';
import './build_scripts/build-css';
import './build_scripts/build-static';
import './build_scripts/build-webpack';
import './build_scripts/build-img';
import { root, paths, resource } from './build_scripts/settings';

const browserSync = browserSyncTool.create('sync');

// clean dist
gulp.task('clean', cb => {
    del.sync([`${paths.dist.root}/*`, `!${paths.dist.root}/.git*`], {
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
            'build:pug',
            'build:sass',
            'build:webpack',
            'build:static'
        )
    )
);

// production option
gulp.task('production', () => {
    process.env.NODE_ENV = 'production';
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

    // browserSync.init({
    //   server: {baseDir: paths.dist.root},
    //   notify: false
    // })

    // watch for source
    function errorHandler(err) {
        // eslint-no-console ignore
        console.log(err.toString());
    }

    gulp.watch(resource.src.pug, gulp.series('build:pug')).on(
        'error',
        errorHandler
    );

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
gulp.task('default', gulp.series(['build', 'server']));
