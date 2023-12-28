import React, { useState, useEffect } from "react";
import { Route, withRouter } from "react-router-dom";
import { useStores } from "@/store";

const PrivateRoute = props => {
    const [afterLoading, setAfterLoading] = useState(true);
    const {
        rootStore: { setGsTitle }
    } = useStores();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const renderComponent = param => {
        const { component: Component } = props;
        return <Component {...param} />;
    };

    const { component: Component, ...rest } = props;
    return afterLoading ? <Route {...rest} render={renderComponent} /> : null;
};

export default withRouter(PrivateRoute);
