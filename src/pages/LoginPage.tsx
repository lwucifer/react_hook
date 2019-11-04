import React from "react";
import {useObserver, useLocalStore} from "mobx-react-lite";
import AppUtils, {
    clearInvalidProp,
    createInputStore,
    createInputProp,
    createInputValueObject,
    postRequest,
    setFetchToken,
    setUserId,
    setUserName,
    ErrorResData
} from "../utils/AppUtils";

import Button from "../components/Button";
import Label from "../components/Label";
import Text from "../components/Text";
import Password from "../components/Password";
import Row from "../components/Row";
import useReactRouter from "use-react-router";
import {storeContext} from "../Context";

/** @jsx jsx */
import {jsx, css} from "@emotion/core";

export const jsxBabelFix = jsx;

type LoginPageProp = {};

const LoginPage: React.FC<LoginPageProp> = prop => {
  const { history } = useReactRouter();
  const grobalStore = React.useContext(storeContext);
  const loginUser = grobalStore!.loginUser;
  const store = useLocalStore(() => ({
    userId: createInputStore<string>("ユーザーID"),
    password: createInputStore<string>("パスワード"),
    async doLogin() {
      clearInvalidProp(this);
      const res = await postRequest<{
        token: string;
        userId: string;
        userName: string;
        bushoCode: string;
        bumonCode: string;
        teamCode: string;
        adminFlg: boolean;
      }>("login/doLogin", createInputValueObject(this));
      if (res instanceof ErrorResData) {
        grobalStore!.showInvalidAlert(res, this);
      } else {
        setFetchToken(res.token);

        loginUser.loggedIn = true;
        loginUser.userId = res.userId;
        loginUser.userName = res.userName;
        loginUser.bushoCode = res.bushoCode;
        loginUser.bumonCode = res.bumonCode;
        loginUser.teamCode = res.teamCode;
        loginUser.adminFlg = res.adminFlg;

        AppUtils.setLoginUser(loginUser);
        setUserId(loginUser.userId);
        setUserName(loginUser.userName);
        
        history.push("/mainmenu");
      }
    }
  }));

    return useObserver(() => (
        <div
            css={css({
                display: "grid",
                gridTemplateColumns: "100vw",
                gridTemplateRows: "90vh"
            })}
        >
            <div
                css={css({
                    justifySelf: "center",
                    alignSelf: "center",
                    padding: "15px 10px 15px",
                    width: 500,
                    textAlign: "center"
                })}
                onKeyDown={(e)=> {if(e.keyCode == 13) store.doLogin()}}
            >
                <h2>
                    三井ホームデザイン研究所<br/>
                    業務システム
                </h2>
                <br/>
                <br/>
                <div className={"form"}>
                    <Row>
                        <Label width={120}>ユーザーID：</Label>
                        <Text width={330} imeOff {...createInputProp(store.userId)} />
                    </Row>
                    <Row>
                        <Label width={120}>パスワード：</Label>
                        <Password width={330} {...createInputProp(store.password)} />
                    </Row>
                </div>
                <Row>
                    <br/>
                    <br/>
                    <div css={css({margin: "0 auto"})}>
                        <Button onClick={store.doLogin}>ログイン</Button>
                    </div>
                </Row>
            </div>
        </div>
    ));
};
export default LoginPage;
