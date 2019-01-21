/* eslint-disable no-console */
import gulp from 'gulp';
import gulpLoaderPlugins from 'gulp-load-plugins';
import browserSyncTool from 'browser-sync';
import initGetData from 'jade-get-data';
import posthtmlInclude from 'posthtml-include';
import posthtmlBem from 'posthtml-bem';
import { root, paths, resource, buildSettings } from './settings';
import getMarkDown from './get-markdown';

const getData = initGetData(paths.src.data);
const getMD = getMarkDown(paths.src.data);
const $ = gulpLoaderPlugins();

// compile Pug -> HTML

const errorHandler = err => {
    console.log(err);
};

gulp.task('build:postHtml', cb => {
    const browserSync = browserSyncTool.get('sync');
    const plugins = [posthtmlInclude({ root: root.src }), posthtmlBem()];
    const posthtmlConfig = {};

    gulp.src(resource.src.html)
        .pipe($.plumber({ errorHandler }))
        .pipe($.posthtml(plugins, posthtmlConfig))
        .pipe(gulp.dest(paths.dist.root))
        .pipe(browserSync.stream());
    cb();
});

gulp.task('build:pug', cb => {
    const browserSync = browserSyncTool.get('sync');

    let formatter = $.prettydiff({
        mode: 'beautify',
        lang: 'html',
        force_indent: true
    });

    if (buildSettings.prettier === 'prettier') {
        formatter = $.prettier({
            parser: 'html',
            language: 'handlebars'
        });
    }

    if (buildSettings.prettier === 'beautifier') {
        formatter = $.jsbeautifier({
            end_with_newline: true,
            indent_inner_html: true
        });
    }

    gulp.src(resource.src.pug)
        .pipe($.plumber({ errorHandler }))
        .pipe($.pug({ basedir: root.src, locals: { getData, getMD } }))
        .pipe(formatter)
        .pipe(gulp.dest(paths.dist.root))
        .pipe(browserSync.stream());
    cb();
});

gulp.task('build:html', gulp.series(['build:postHtml', 'build:pug']));
