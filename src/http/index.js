import axios from "axios";
import { Toast } from "antd-mobile";
import { getMethodParams, postMethodParams } from "./ajaxCommonParams";
import { rootStore } from "@/pages/main";
import { baseName } from "@/config";

const httpInstance = axios.create({
    withCredentials: true
});

let baseURL = {};

switch (process.env.APP_ENV) {
    case "local":
        baseURL = { api: "", csmsapi: "", gsapi: "", hsapi: "", rapi: "", bapi: "" };
        break;
    case "test":
        baseURL = { api: "http://test-help.imee.com" };
        break;
    case "prod":
        baseURL = { api: "http://101.133.232.167" };
        break;
    default:
        baseURL = {};
        break;
}

const formatData = (newParam = {}) => {
    const formData = new FormData();
    Object.keys(newParam).forEach(item => {
        formData.append(`${item}`, newParam[item]);
    });
    return formData;
};

const getRequestFlag = url => {
    let which,
        realUrl = url;
    if (url.startsWith("/api")) {
        which = "api";
        if (process.env.APP_ENV != "local") realUrl = url.replace("/api", "");
    } else {
        which = "";
        realUrl = "";
    }
    return [which, realUrl];
};

const http = {
    post(url, data, flag) {
        const [which, realUrl] = getRequestFlag(url);
        return httpInstance({
            method: "post",
            baseURL: baseURL[which],
            url: `${realUrl}`,
            data: formatData(data)
        });
    },
    get(url, params, extra) {
        const [which, realUrl] = getRequestFlag(url);
        const extra_headers = {};
        return httpInstance({
            method: "get",
            baseURL: baseURL[which],
            url: `${realUrl}`,
            params,
            ...extra
        });
    }
};

const testToken = "";

httpInstance.interceptors.request.use(
    async config => {
        const { setLoading } = rootStore;
        setLoading(true);
        const { token, uid } = { token: testToken };
        if (uid) localStorage.setItem("gs-uid", uid);
        config.headers["user-token"] = token;
        if (config.method == "post") {
            let ajaxCommonStr = postMethodParams();
            let url = config.url;
            if (url.split("?").length == 1 && ajaxCommonStr) {
                config.url = url + "?" + ajaxCommonStr;
            } else if (ajaxCommonStr) {
                config.url = url + "&" + ajaxCommonStr;
            }
        } else if (config.method == "get") {
            let ajaxCommonParams = getMethodParams();
            config.params = {
                ...ajaxCommonParams,
                ...config.params
            };
        }
        return config;
    },
    error => {
        console.log("------");
        console.log(error);
        console.log("------");
        return Promise.reject(error);
    }
);

httpInstance.interceptors.response.use(
    res => {
        const { setLoading } = rootStore;
        setLoading(false);
        const { data } = res;
        console.log(res);
        const { success, code, msg } = data;
        if (code == 0) {
            return Promise.resolve(data);
        } else {
            Toast.show({ content: `${msg || "system error"}` });
            return Promise.reject(data);
        }
    },
    error => {
        const { setLoading } = rootStore;
        setLoading(false);
        console.log("&&&&");
        console.log(error);
        console.log("&&&&");
        let errorMsgText = "系统忙不过来啦，稍等一下";
        Toast.show("系统错误,请稍后再试");
        return Promise.reject(error.response);
    }
);

export default http;
