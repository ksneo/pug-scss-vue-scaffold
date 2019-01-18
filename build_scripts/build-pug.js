import gulp from 'gulp';
import gulpLoaderPlugins from 'gulp-load-plugins';
import browserSyncTool from 'browser-sync';
import initGetData from 'jade-get-data';
import { root, paths, resource, buildSettings } from './settings';
import getMarkDown from './get-markdown';

const getData = initGetData(paths.src.data);
const getMD = getMarkDown(paths.src.data);
const $ = gulpLoaderPlugins();

// compile Pug -> HTML
let formatter = $.prettydiff({
    mode: 'beautify',
    lang: 'html',
    force_indent: true
});

if (buildSettings.prettier === 'prettier') {
    formatter = $.prettier({ language: 'handlebars' });
}

if (buildSettings.prettier === 'beautifier') {
    formatter = $.jsbeautifier({
        end_with_newline: true,
        indent_inner_html: true
    });
}

const errorHandler = err => {
    console.log(err);
};

gulp.task('build:pug', cb => {
    const browserSync = browserSyncTool.get('sync');
    gulp.src(resource.src.html)
        .pipe($.plumber({ errorHandler }))
        .pipe($.pug({ basedir: root.src, locals: { getData, getMD } }))
        .pipe(formatter)
        .pipe(gulp.dest(paths.dist.root))
        .pipe(browserSync.stream());
    cb();
});
