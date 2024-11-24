"use strict";

const pkg = require("./package.json");
const author =
    pkg.author.name + " <" + pkg.author.email + "> (" + pkg.author.url + ")";

module.exports = {
    mode: "development",

    devtool: "source-map",

    entry: "./src/index.ts",

    resolve: {
        extensions: [".ts", ".js"],
    },

    output: {
        library: "SuperEventEmitter",
        libraryTarget: "umd",
        filename: "[name].js",
        path: __dirname + "/dist/",
        globalObject: "this",
        clean: true,
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                    {
                        loader: "string-replace-loader",
                        options: {
                            multiple: [
                                {
                                    search: "$AUTHOR$",
                                    replace: author,
                                    strict: true,
                                },
                                {
                                    search: "$NAME$",
                                    replace: pkg.name,
                                    strict: true,
                                },
                                {
                                    search: "$DESCRIPTION$",
                                    replace: pkg.description,
                                    strict: true,
                                },
                                {
                                    search: "$VERSION$",
                                    replace: pkg.version,
                                    strict: true,
                                },
                                {
                                    search: "$VERSION$",
                                    replace: pkg.version,
                                    strict: true,
                                },
                                {
                                    search: "$LICENSE$",
                                    replace: pkg.license,
                                    strict: true,
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    },
};
