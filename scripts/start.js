process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";
process.env.PUBLIC_URL = "/";
process.env.PUBLIC_URL_ICO = "";
process.on("unhandledRejection", err => {
    console.log(err);
    throw err;
});
// Ensure environment variables are read.
require("./utils/env");

const path = require("path");
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackConfig = require("./webpack.dev.js");
const app = express();
const setupProxy = require("./setupProxy");
const config = require("./config");

let PORT = config["devPort"]; // 服务启动端口号

// 实例化webpack
const compiler = webpack(webpackConfig);
app.use(
    webpackDevMiddleware(compiler, {
        publicPath: ""
    })
);
// 挂载HMR热更新中间件
app.use(
    webpackHotMiddleware(compiler, {
        path: "/__webpack_hmr"
    })
);

// 注册代理
setupProxy(app);

// 所有请求都返回对应项目的index.html
app.get("*", (req, res, next) => {
    let filename = path.join(path.resolve(__dirname, "../dist"), "index.html");
    compiler.outputFileSystem.readFile(filename, (err, result) => {
        if (err) {
            return next(err);
        }
        res.set("content-type", "text/html");
        res.send(result);
        res.end();
    });
});

/** 启动服务 **/
app.listen(PORT, () => {
    console.log("本地服务启动地址: http://localhost:%s", PORT);
});
