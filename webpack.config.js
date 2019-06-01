'use strict';

var readPkg = require('read-pkg');

module.exports = async () => {
    var pkg = await readPkg();
    var author = pkg.author.name + ' <' + pkg.author.email + '> (' + pkg.author.url + ')';

    return {
        mode: 'none',

        entry: {
            'super-event-emitter': './index.js',
        },

        output: {
            library: 'EventEmitter',
            libraryTarget: 'umd',
            filename: '[name].js',
            path: __dirname + '/dist/'
        },

        devtool: 'source-map',

        module: {
            rules: [
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                {
                    test: /\.js$/,
                    loader: 'string-replace-loader',
                    query: {
                        multiple: [
                            { search: '$AUTHOR$', replace: author },
                            { search: '$NAME$', replace: pkg.name },
                            { search: '$DESCRIPTION$', replace: pkg.description },
                            { search: '$VERSION$', replace: pkg.version },
                            { search: '$PKG_VERSION$', replace: pkg.version },
                            { search: '$LICENSE$', replace: pkg.license }
                        ]
                    }
                }
            ]
        }
    };
};
