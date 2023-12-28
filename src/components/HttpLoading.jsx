import React from "react";
import { SpinLoading } from "antd-mobile";
import { If } from "./index";
export default ({ show }) => {
    let color;
    const currentUrl = window.location.href;
    if (currentUrl.includes("/hs/")) {
        color = "#ff971c";
    } else if (currentUrl.includes("/cs/")) {
        color = "#58ceff";
    } else {
        color = "primary";
    }
    return (
        <If data={show}>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 999999
                }}
            >
                <SpinLoading color={color} />
            </div>
        </If>
    );
};
