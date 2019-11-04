import React from "react";
import Button from "../components/Button";
import useReactRouter from "use-react-router";
import { storeContext } from "../Context";
/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import AppUtils, { getUserName } from "../utils/AppUtils";

export const jsxBabelFix = jsx;

type MainLayoutPageProp = {
    systemName: string;
    tilte: string;
};

const MainLayout: React.FC<MainLayoutPageProp> = prop => {
    const { history } = useReactRouter();
    const grobalStore = React.useContext(storeContext);
    return (
        <div>
            <div className="d-flex align-items-center col border-bottom pt-2 pb-2 pl-4 pr-4">
                <h3>{prop.systemName}</h3>
                <div className="ml-auto">
                    <span className="mr-3">
                        ログインユーザー：<span>{getUserName()}</span>
                    </span>
                    <Button
                        onClick={() => {
                            history.push("/mainmenu");
                        }}
                    >
                        メインメニュー
                    </Button>
                    <Button
                        onClick={() => {
                            AppUtils.logout();
                            grobalStore!.loginUser = {
                                loggedIn: false,
                                userId: "",
                                userName: "",
                                bushoCode: "",
                                bumonCode: "",
                                teamCode: ""
                            };
                            history.push("/");
                        }}
                    >
                        ログアウト
                    </Button>
                </div>
            </div>
            <div className="table-title">
                <h5 css={css({ textAlign: "left" })}>{prop.tilte}</h5>
            </div>
            <div
                css={css({
                    gridRow: "3 / 4",
                    gridColumn: "1 / 4",
                    textAlign: "left",
                    padding: "1rem 1.5rem 0"
                })}
            >
                {prop.children}
            </div>
        </div>
    );
};
export default MainLayout;
