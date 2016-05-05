'use strict';

var webpack = require('webpack');

module.exports = {
    entry: {
        'super-event-emitter': './index.js',
        'super-event-emitter.min': './index.js'
    },

    devtool: 'source-map',

    output: {
        library: 'EventEmitter',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        filename: '[name].js',
        path: './dist/'
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ]
};
