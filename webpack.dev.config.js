const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');

const devWebpackConfig = merge(baseWebpackConfig, {
    watch: true,
    watchOptions: {
        aggregateTimeout: 100,
        poll: 350,
        ignored: '**/node_modules',
    },
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        })
    ]
});

module.exports = new Promise((resolve) => {
    resolve(devWebpackConfig);
});

