/*
 + ------------------------------------------------------------------
 | 这是用于开发环境的webpack配置文件
 + ------------------------------------------------------------------ 
 */
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const path = require("path");
const commonCfg = require("./webpack.common.js");
const stringified = require("./utils/env");

const genProjectConfig = project => ({
    name: project,
    mode: "development",
    entry: ["webpack-hot-middleware/client?reload=true&path=/__webpack_hmr", path.resolve(__dirname, "../src/index.js")],
    output: {
        publicPath: process.env.PUBLIC_URL,
        filename: "bundle-[contenthash].js",
        path: path.resolve(__dirname, `../dist`),
        pathinfo: true
    },
    devtool: "eval-cheap-module-source-map",
    plugins: [
        // 热更新插件
        new webpack.HotModuleReplacementPlugin(),
        // 在window环境中注入全局变量
        new webpack.DefinePlugin({
            "process.env.RUN_ENV": JSON.stringify("development"),
            ...stringified
        })
    ]
});

module.exports = merge(commonCfg, genProjectConfig("web"));
