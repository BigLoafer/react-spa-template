import pageRoutes from "../pages/page-routes";
import React, { lazy } from "react";

// 所有人都可以访问的页面
export const commonPaths = [];

/*
 * 非脚本抓取的路由，可以在这里编辑，脚本抓取的路由在./src/pages/page-routes.js中
 * */
export default [].concat(pageRoutes).map(item => {
    return {
        path: item.path,
        component: lazy(item.component)
    };
});
