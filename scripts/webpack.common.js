/*
 + ------------------------------------------------------------------
 |  通用的webpack配置文件
 + ------------------------------------------------------------------ 
 */
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const chalk = require("chalk");
const configForSeo = require("./config");

module.exports = {
    module: {
        rules: [
            {
                test: /page-routes\.js$/,
                enforce: "pre",
                use: path.resolve(__dirname, "./loader/route-loader.js"),
                include: path.resolve(__dirname, "../src")
            },
            {
                test: /.(eot|woff|otf|svg|ttf|woff2|appcache|mp3|mp4|mov|pdf)$/i,
                include: path.resolve(__dirname, "../src"),
                type: "asset/resource",
                generator: {
                    filename: "css/[name]-[hash:8].[ext]?v=[hash:8]"
                }
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                include: path.resolve(__dirname, "../src"),
                type: "asset/resource",
                generator: {
                    filename: "assets/[name]-[hash:8].[ext]?v=[hash:8]"
                }
            },
            {
                test: /\.ico$/i,
                include: path.resolve(__dirname, "../src"),
                type: "asset/resource",
                generator: {
                    filename: "assets/[name].[ext]"
                }
            },
            {
                test: /\.css$/i,
                include: [path.resolve(__dirname, "../src"), path.resolve(__dirname, "../node_modules")],
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
            },
            {
                test: /\.less$/i,
                include: path.resolve(__dirname, "../src"),
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2,
                            sourceMap: true
                        }
                    },
                    "postcss-loader",
                    {
                        loader: "thread-loader",
                        options: {
                            workerParallelJobs: 2
                        }
                    },
                    "less-loader"
                ]
            },
            {
                test: /\.(js|jsx)$/,
                include: [path.resolve(__dirname, "../src"), path.resolve(__dirname, "../node_modules/kiwi-intl")],
                use: [
                    {
                        loader: "thread-loader",
                        options: {
                            workers: 2
                        }
                    },
                    "babel-loader"
                ]
            }
        ]
    },
    resolve: {
        // 后缀名自动补全
        extensions: [".js", ".jsx", ".less", ".css"],
        alias: {
            "~": path.resolve(__dirname, "../"),
            "@": path.resolve(__dirname, "../src"),
            "src": path.resolve(__dirname, "../src")
        },
        symlinks: false,
        modules: ["node_modules"]
    },
    plugins: [
        //拷贝public中的文件到最终打包文件夹里
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../public"),
                    to: path.resolve(__dirname, "../dist"),
                    globOptions: {
                        ignore: ["**/index.html"]
                    },
                    noErrorOnMissing: true
                }
            ]
        }),
        // 自动生成HTML，并注入各参数
        new HtmlWebpackPlugin({
            filename: "index.html",
            title: configForSeo.title,
            meta: {
                keywords: configForSeo.keywords,
                description: configForSeo.description
            },
            template: path.resolve(__dirname, "../public/index.html"),
            hash: false,
            inject: true
        }),
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
            "PUBLIC_URL": process.env.PUBLIC_URL,
            "PUBLIC_URL_ICO": process.env.PUBLIC_URL_ICO
        }),
        new AddAssetHtmlPlugin(),
        // 进度条
        new ProgressBarPlugin({
            format: `:msg [:bar] ${chalk.green.bold(":percent")} (:elapsed s)`
        }),
        // 提取CSS等样式生成单独的CSS文件,不然最终文件只有js； css全部包含在js中
        new MiniCssExtractPlugin({
            filename: "css/[name].css?v=[chunkhash:8]",
            ignoreOrder: true
        })
    ],
    cache: {
        type: "filesystem"
    }
};
