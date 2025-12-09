// webpack.common.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        userplus: './src/userplus.ts',
        survey: './src/survey/survey.ts',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist'),
        globalObject: 'this',
    },
};