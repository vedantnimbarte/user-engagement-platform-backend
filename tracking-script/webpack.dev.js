// webpack.dev.js
const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'test'),
    },
    // Using webpack-dev-server for a better dev experience
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'src/test'),
        },
        open: true,
        hot: true,
        compress: true,
        port: 8080,
    },
    plugins: [
        // Override DEBUG flag for development
        new webpack.DefinePlugin({
            'process.env.DEBUG': JSON.stringify(true),
        }),
    ],
});