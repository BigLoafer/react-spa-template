process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";
require("./utils/env");
if (process.env.APP_ENV.indexOf("prod") !== -1) {
    process.env.PUBLIC_URL = `${process.env.BASE_NAME}/`;
    process.env.PUBLIC_URL_ICO = process.env.BASE_NAME;
}
if (process.env.APP_ENV.indexOf("test") !== -1) {
    process.env.PUBLIC_URL_ICO = "";
    process.env.PUBLIC_URL = "/";
}

process.on("unhandledRejection", err => {
    throw err;
});

const webpack = require("webpack");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require("webpack-merge");
const path = require("path");
// const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const commonCfg = require("./webpack.common.js");
const stringified = require("./utils/env");

console.log("[Build Environment]", process.env.APP_ENV, process.env.BUILD_DIR);

const genProjectConfig = (project, environment, buildDir) => ({
    name: project,
    mode: "production",
    entry: path.resolve(__dirname, `../src/index.js`),
    output: {
        path: path.resolve(__dirname, `../${buildDir}`),
        publicPath: process.env.PUBLIC_URL,
        clean: true,
        filename: "js/[name].js?v=[chunkhash:8]",
        chunkFilename: "js/[name].js?v=[chunkhash:8]"
    },
    stats: {
        children: false
    },
    optimization: {
        minimize: true,
        runtimeChunk: {
            name: "runtime"
        },
        moduleIds: "deterministic",
        minimizer: [
            new TerserPlugin({
                parallel: 4,
                terserOptions: {
                    parse: {
                        ecma: 8
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2
                    },
                    mangle: {
                        safari10: true
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true
                    }
                }
            }),
            new CssMinimizerPlugin({
                parallel: 4
            })
        ],
        splitChunks: {
            // chunks: "all",
            cacheGroups: {
                common: {
                    // 自定义命名
                    name: "common",
                    chunks: "all",
                    minSize: 0, // 最小大小为多少才抽离
                    minChunks: 3, // 最少使用多少次及以上才抽离
                    maxSize: 2500000
                },
                vendors: {
                    // node_modules里的代码
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "initial",
                    name: "vendors", //一定不要定义固定的name
                    priority: 10, // 优先级
                    enforce: true,
                    maxSize: 2500000
                    // minSize: 102400
                    // minChunks: 1,
                }
            }
        }
    },
    plugins: [
        //  打包前删除上一次打包留下的旧代码（根据output.path）
        new CleanWebpackPlugin(),
        // 在window环境中注入全局变量
        new webpack.DefinePlugin({
            "process.env.RUN_ENV": JSON.stringify(environment === "prod" ? "production" : environment),
            ...stringified
        })
        // CSS Tree Shaking
        // new PurgeCSSPlugin({
        //     paths: glob.sync(`${path.resolve(__dirname, "../src")}/**/*`, { nodir: true }),
        // }),
    ]
});

module.exports = merge(commonCfg, genProjectConfig("web", process.env.NODE_ENV, process.env.BUILD_DIR || "dist"));
