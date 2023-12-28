import { baseName } from "@/config";
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid() {
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4() + ".M";
}

function getAjaxCommonParams() {
    // const envObj = { uid: localStorage.getItem("gs-uid") };
    const envObj = {};
    if (window.location.pathname.startsWith(`${baseName}/hs`) && localStorage.getItem("hs-user")) {
        envObj["usrtoken"] = localStorage.getItem("hs-user");
    }
    if (window.location.pathname.startsWith(`${baseName}/pdy`) && localStorage.getItem("pdy-user")) {
        envObj["usrtoken"] = localStorage.getItem("pdy-user");
    }
    if (window.location.pathname.startsWith(`${baseName}/pdy`)) {
        envObj["appid"] = "2";
    }
    let ajaxCommonParams = {
        ...envObj
    };
    return ajaxCommonParams;
}

function getMethodParams() {
    return getAjaxCommonParams();
}
function postMethodParams() {
    let ajaxCommonParams = getAjaxCommonParams();
    let ajaxCommonStrArr = Object.keys(ajaxCommonParams).map((item, index) => {
        if (index == 0) {
            return `${item}=${ajaxCommonParams[item]}`;
        } else {
            return `&${item}=${ajaxCommonParams[item]}`;
        }
    });

    let ajaxCommonStr = "";
    ajaxCommonStrArr.forEach(item => {
        ajaxCommonStr += item;
    });
    return ajaxCommonStr;
}

export { getMethodParams, postMethodParams };
