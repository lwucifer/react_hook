import React, { useContext } from "react";
import { storeContext } from "../Context";
import { useObserver } from "mobx-react-lite";
import { Redirect } from "react-router-dom";

type AuthProp = {};

const Auth: React.FC<AuthProp> = props => {
    const grobalStore = useContext(storeContext);
    const store = grobalStore!.loginUser;

    return useObserver(() => {
        return <>{store.loggedIn ? props.children : <Redirect to={"/"} />}</>;
    });
};

export default Auth;
