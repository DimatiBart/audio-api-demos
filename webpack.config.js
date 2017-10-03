const path = require('path');
const webpack = require("webpack");

const config = {
    entry: "./src/index.jsx",
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/dist",
        filename: "bundle.js"
    },
    module: {
        rules: [
            {test: /\.jsx?$/, use: "babel-loader"}
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: "#source-map",
    devServer: {
        hot: true,
        disableHostCheck: true,
        host: "0.0.0.0"
    }
};

module.exports = config;