import React from "react";
import { SpinLoading } from "antd-mobile";

export default ({ height }) => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: height || "100vh"
            }}
        >
            <SpinLoading color="primary" />
        </div>
    );
};
