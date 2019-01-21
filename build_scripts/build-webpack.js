import gulp from 'gulp';
import gulpLoaderPlugins from 'gulp-load-plugins';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import named from 'vinyl-named';
import browserSyncTool from 'browser-sync';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
import { paths, resource, production } from './settings';

const $ = gulpLoaderPlugins();
// compile Webpack [ ES6(Babel) / Vue -> Multipage ]

gulp.task('build:webpack', cb => {
    const browserSync = browserSyncTool.get('sync');

    const webpackConfig = {
        mode: 'development',
        devtool: '#source-map',
        output: { filename: '[name].js' },
        watch: !production(),
        module: {
            rules: [
                { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
                { test: /\.ts$/, use: 'babel-loader', exclude: /node_modules/ },
                { test: /\.vue$/, use: 'vue-loader', exclude: /node_modules/ },
                { test: /\.html$/, use: 'raw-loader' }
            ]
        },
        plugins: [new VueLoaderPlugin()],
        resolve: {
            modules: ['node_modules', paths.src.js],
            extensions: ['*', '.js', '.vue'],
            alias: {
                vue$: 'vue/dist/vue.esm.js',
                constants: `${paths.src.js}/constants`
            }
        }
    };

    if (production()) {
        webpackConfig.mode = 'production';
        webpackConfig.optimization = {
            minimize: true
        };
    }

    gulp.src(resource.src.webpack.babel)
        .pipe(named())
        .pipe($.plumber())
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest(paths.dist.js))
        .pipe(browserSync.stream());
    cb();
});
