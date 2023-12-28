const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        createProxyMiddleware(["/api"], {
            target: "http://101.133.232.167",
            pathRewrite: {
                "^/api": ""
            },
            changeOrigin: true,
            secure: false,
            ws: true
        })
    );
};
