import React, { Suspense } from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { CacheSwitch } from "react-router-cache-route";
import { Provider, observer } from "mobx-react";
import pageRoutes from "../route/routes";
import MyRoute from "../route";
import Loading from "../components/Loading";
import rootStore from "../store/RootStore";
import { baseName } from "@/config";
import * as modules from "./index";
import HttpLoading from "@/components/HttpLoading";

const needCachePage = [];
let injectStores = { rootStore };

Object.keys(modules).forEach(moduleKey => {
    injectStores = { ...injectStores, ...modules[moduleKey].store };
});

const renderRoutes = data => {
    return data.map((item, index) => {
        return <MyRoute obj={item} exact component={item.component} path={`${item.path}`} key={index} />;
    });
};

const App = () => {
    const {
        state: { gs_title, showLoading }
    } = rootStore;
    return (
        <Provider {...injectStores}>
            <Router basename={baseName}>
                <div>
                    <HttpLoading show={showLoading} />
                    <Suspense fallback={<Loading />}>
                        <CacheSwitch which={el => needCachePage.includes(el.props?.path)}>
                            {/* <Switch> */}
                            {renderRoutes(pageRoutes)}
                            <Redirect to="/" />
                            {/* </Switch> */}
                        </CacheSwitch>
                    </Suspense>
                </div>
            </Router>
        </Provider>
    );
};
export { rootStore };
export const StoresContext = React.createContext(injectStores);
export default observer(App);
