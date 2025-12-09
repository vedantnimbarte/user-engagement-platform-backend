// webpack.prod.js
const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    // No devtool so that sourcemaps are not generated
    output: {
        path: path.resolve(__dirname, 'dist'),
        // Optionally include contenthash in production filename for cache busting
        filename: 'userplus.js',
    },
    plugins: [
        // Clean the 'dist' folder before each build
        new CleanWebpackPlugin(),
        // Define production environment variables
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.DEBUG': JSON.stringify(false),
        }),
        // Analyze bundle size. Generates a static report not auto-opened.
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: 'bundle-report.html',
        }),
        // Gzip compression
        new CompressionPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240, // Only assets bigger than 10kb are processed
            minRatio: 0.8,
        }),
        // Brotli compression (alternative to gzip)
        new BrotliPlugin({
            asset: '[path][base].br',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
    ],
});