const path = require('path');

const config = {
    entry: "./src/index.jsx",
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "./src",
        filename: "bundle.js"
    },
    module: {
        rules: [
            {test: /\.jsx?$/, use: "babel-loader"}
        ]
    }
};

module.exports = config;