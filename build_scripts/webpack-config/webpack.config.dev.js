const helpers = require('./helpers'),
  webpackConfig = require('./webpack.config.base'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  DefinePlugin = require('webpack/lib/DefinePlugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  BundleTracker = require('webpack-bundle-tracker'),
  autoprefixer = require('autoprefixer'),
  settings = require('./settings'),
  path = require('path'),
  html = require('js-beautify').html,
  fs = require('fs'),
  pug = require('pug'),
  env = require('../environment/dev.env');


if (fs.exists(helpers.root(settings.src_folder, 'html'))) {
  webpackConfig.module.rules = [
    ...webpackConfig.module.plugins,
    new CopyWebpackPlugin([
      {
        from: helpers.root(settings.src_folder, 'html'),
        to: './[path][name].html',
        transform: function (content, file_path) {
          if (path.extname(file_path) === '.pug') {
            return html(pug.render(content), {});
          }
        }
      }
    ])
  ]
}

webpackConfig.module.rules = [
  ...webpackConfig.module.rules
];

webpackConfig.plugins = [
  ...webpackConfig.plugins,
  extractSass,
  new HtmlWebpackPlugin({
    inject: true,
    template: helpers.root(settings.src_folder, 'index.pug'),
    favicon: helpers.root(settings.src_folder, 'favicon.ico'),
    filename: 'index.html'
  }),
  new DefinePlugin({'process.env': env}),
  new BundleTracker({filename: './webpack-stats.json'})
];

webpackConfig.watchOptions = {
  aggregateTimeout: 300,
  poll: 1000
}

module.exports = webpackConfig;
