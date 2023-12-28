import React from "react";
import ReactDOM from "react-dom/client";
import "./style/global.less";
// import "./style/variable.css";
import App from "./pages/main";

const setConsole = async () => {
    let { default: VConsole } = await import("vconsole");
    new VConsole();
};
setConsole();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
