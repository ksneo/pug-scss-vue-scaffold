const HtmlWebpackPlugin = require('html-webpack-plugin');

const DefinePlugin = require('webpack/lib/DefinePlugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const BundleTracker = require('webpack-bundle-tracker');

const autoprefixer = require('autoprefixer');

const path = require('path');

const html = require('js-beautify').html;

const fs = require('fs');

const pug = require('pug');
const settings = require('./settings');
const webpackConfig = require('./webpack.config.base');
const helpers = require('./helpers');

const env = require('../environment/dev.env');

if (fs.exists(helpers.root(settings.src_folder, 'html'))) {
    webpackConfig.module.rules = [
        ...webpackConfig.module.plugins,
        new CopyWebpackPlugin([
            {
                from: helpers.root(settings.src_folder, 'html'),
                to: './[path][name].html',
                transform(content, file_path) {
                    if (path.extname(file_path) === '.pug') {
                        return html(pug.render(content), {});
                    }
                }
            }
        ])
    ];
}

webpackConfig.module.rules = [...webpackConfig.module.rules];

webpackConfig.plugins = [
    ...webpackConfig.plugins,
    extractSass,
    new HtmlWebpackPlugin({
        inject: true,
        template: helpers.root(settings.src_folder, 'index.pug'),
        favicon: helpers.root(settings.src_folder, 'favicon.ico'),
        filename: 'index.html'
    }),
    new DefinePlugin({ 'process.env': env }),
    new BundleTracker({ filename: './webpack-stats.json' })
];

webpackConfig.watchOptions = {
    aggregateTimeout: 300,
    poll: 1000
};

module.exports = webpackConfig;
