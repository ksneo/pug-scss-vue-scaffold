import gulp from 'gulp'
import gulpLoaderPlugins from 'gulp-load-plugins'
import del from 'del'
import path from 'path'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import runSequence from 'run-sequence'
import browserSyncTool from 'browser-sync'
import named from 'vinyl-named'
import RevAll from 'gulp-rev-all'
import './build_scripts/build-pug'
import {root, paths, resource} from './build_scripts/settings';

const $ = gulpLoaderPlugins()
const browserSync   = browserSyncTool.create()
const reload = browserSync.reload;

let production = false

// console.log($);
// build and watch for developer
gulp.task('default', ['build', 'server'])

//## build for developer
gulp.task('build', (callback) =>
  runSequence('clean', ['build:pug', 'build:sass', 'build:webpack', 'build:static'], callback)
)

//## build production
gulp.task('build-prod', (callback) =>
  runSequence('production', 'build', 'revision', callback)
)

// clean dist
gulp.task('clean', () =>
  del.sync([`${paths.dist.root}/*`, `!${paths.dist.root}/.git*`], { force: true })
)

// production option
gulp.task('production', () => production = true )

// support Resource Revision
gulp.task('revision', (callback) =>
  runSequence('revision:clean', 'revision:append', 'clean', 'revision:copy', 'revision:clean', callback)
)

// compile Webpack [ ES6(Babel) / Vue -> Multipage ]
gulp.task('build:webpack', () => {
  process.env.NODE_ENV = (production == true) ? 'production' : 'development'
  if (production) plugins.push(new webpack.optimize.UglifyJsPlugin({compress: { warnings: false　}}))
  return gulp.src([resource.src.webpack.babel])
    .pipe(named())
    .pipe($.plumber())
    .pipe(webpackStream({
      devtool: '#source-map',
      output: {filename: '[name].js'},
      watch: !production,
      module: {
        rules: [
          {test: /\.js$/, use: 'babel-loader', exclude: /node_modules/},
          {test: /\.vue$/, use: 'vue-loader', exclude: /node_modules/}
        ],
      },
      resolve: {
        modules: ['node_modules', paths.src.js],
        extensions: ['*', '.js', '.vue'],
        alias: {
          vue: 'vue/dist/vue.common.js',
          constants: `${paths.src.js}/constants`,
        }
      }
     }, webpack))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.stream())
})

// compile Sass -> CSS
gulp.task('build:sass', () => {
  return gulp.src(resource.src.sass)
    .pipe($.plumber())
    .pipe($.sass())
    .pipe($.concat('style.css'))
    .pipe($.pleeease())
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream())
})

// copy Static Resource
gulp.task('build:static', () => {
  const libjs = resource.vendor.js
  gulp.src(Object.keys(libjs).map((key) => libjs[key]))
    .pipe($.concat("vendor.bundle.js"))
    .pipe($.if(production, $.uglify()))
    .pipe(gulp.dest(paths.dist.js))
  gulp.src(resource.vendor.css)
    .pipe($.concat('vendor.css'))
    .pipe($.pleeease())
    .pipe(gulp.dest(paths.dist.css))
  gulp.src(resource.vendor.fontawesome)
    .pipe(gulp.dest(paths.dist.font))
  return gulp.src(resource.src.static)
    .pipe(gulp.dest(paths.dist.root))
})

// run Development Web Server (BrowserSync) [localhost:3000]
gulp.task('server', () => {
  browserSync.init({
    server: {baseDir: paths.dist.root},
    notify: false
  })
  // watch for source
  gulp.watch(resource.src.pug,    ['build:pug'])
  gulp.watch(resource.src.sass,   ['build:sass'])
  gulp.watch(resource.src.static, ['build:static'])
  gulp.watch(`${resource.src.components}/**/*.pug`, ['build:pug'], reload())
})

// append Resource Revision
gulp.task('revision:clean', () =>
  del.sync([root.tmp], { force: true })
)

gulp.task('revision:append', () => {
  return gulp.src(`${paths.dist.root}/**/*`)
    .pipe(RevAll.revision({dontRenameFile: [/^\/favicon.ico$/g, '.html']}))
    .pipe(gulp.dest(root.tmp))
})

gulp.task('revision:copy', () => {
  return gulp.src(`${root.tmp}/**/*`)
    .pipe(gulp.dest(paths.dist.root))
})
