import React from "react";
import Button from "../components/Button";
import MainLayout from "../layouts/MainLayout";
import useReactRouter from "use-react-router";
import { storeContext } from "../Context";

/** @jsx jsx */
import { jsx, css } from "@emotion/core";

export const jsxBabelFix = jsx;

type MainMenuPageProp = {};

const btnArea = css({
    padding: 3
});
const btnRow = css({
    display: "inline-block",
    verticalAlign: "top"
});

const btnBlock = css({
    padding: 10,
    display: "inline-block",
    verticalAlign: "top"
});

const MainMenuPage: React.FC<MainMenuPageProp> = prop => {
    const { history } = useReactRouter();
    const grobalStore = React.useContext(storeContext);
    const loginUser = grobalStore!.loginUser;

    return (
        <MainLayout systemName="業務システム" tilte="メインメニュー">
            <div
                css={css(btnBlock, {
                    borderRightStyle: "solid",
                    borderRightWidth: 2
                })}
            >
                <div>
                    <h5>通常業務</h5>
                </div>
                <div css={btnRow}>
                    <div css={btnArea}>
                        <Button
                            size="lg"
                            width={230}
                            onClick={() => {
                                history.push("tanto/list");
                            }}
                        >
                            受注担当者入力
                        </Button>
                    </div>
                    <div css={btnArea}>
                        <Button
                            size="lg"
                            width={230}
                            onClick={() => {
                                history.push("kiso/nyuryoku");
                            }}
                        >
                            基礎データ更新入力
                        </Button>
                    </div>
                    <div css={btnArea}>
                        <Button
                            size="lg"
                            width={230}
                            onClick={() => {
                                history.push("uriage/nyuryoku");
                            }}
                        >
                            売上計上・請求入力
                        </Button>
                    </div>
                    <div css={btnArea}>
                        <Button
                            size="lg"
                            width={230}
                            onClick={() => {
                                history.push("data/output");
                            }}
                        >
                            データ出力
                        </Button>
                    </div>
                </div>
                <div css={btnRow}>
                    <div css={btnArea}>
                        <Button
                            size="lg"
                            width={230}
                            variant="warning"
                            onClick={() => {
                                history.push("mhigaijuchu");
                            }}
                            disabled = {!loginUser.adminFlg}
                        >
                            MH以外受注データ入力
                        </Button>
                    </div>
                    <div css={btnArea}>
                        <Button
                            size="lg"
                            width={230}
                            variant="warning"
                            onClick={() => {
                                history.push("/uriage/kakunin");
                            }}
                            disabled = {!loginUser.adminFlg}
                        >
                            売上計上・請求確認
                        </Button>
                    </div>
                    <div css={btnArea}>
                        <Button
                            size="lg"
                            width={230}
                            variant="warning"
                            onClick={() => {
                                history.push("shanai/bunpai");
                            }}
                            disabled = {!loginUser.adminFlg}
                        >
                            社内分配入力
                        </Button>
                    </div>
                    <div css={btnArea}>
                        <Button
                            size="lg"
                            width={230}
                            variant="warning"
                            onClick={() => {
                                history.push("nyukin");
                            }}
                            disabled = {!loginUser.adminFlg}
                        >
                            MH入金一括取込
                        </Button>
                    </div>
                </div>
            </div>
            <div css={btnBlock}>
                    <div>
                        <div>
                            <h5>マスタ管理業務</h5>
                        </div>
                        <div css={btnRow}>
                            <div css={btnArea}>
                                <Button
                                    size="lg"
                                    width={230}
                                    variant="warning"
                                    onClick={() => {
                                        history.push("busho");
                                    }}
                                    disabled = {!loginUser.adminFlg}
                                >
                                    部署マスタ
                                </Button>
                            </div>
                            <div css={btnArea}>
                                <Button
                                    size="lg"
                                    width={230}
                                    variant="warning"
                                    onClick={() => {
                                        history.push("team");
                                    }}
                                    disabled = {!loginUser.adminFlg}
                                >
                                    チームマスタ
                                </Button>
                            </div>
                            <div css={btnArea}>
                                <Button
                                    size="lg"
                                    width={230}
                                    variant="warning"
                                    onClick={() => {
                                        history.push("torihikisaki");
                                    }}
                                    disabled = {!loginUser.adminFlg}
                                >
                                    取引先マスタ
                                </Button>
                            </div>
                        </div>
                        <div css={btnRow}>
                            <div css={btnArea}>
                                <Button
                                    size="lg"
                                    width={230}
                                    variant="warning"
                                    onClick={() => {
                                        history.push("bumon");
                                    }}
                                    disabled = {!loginUser.adminFlg}
                                >
                                    部門マスタ
                                </Button>
                            </div>
                            <div css={btnArea}>
                                <Button
                                    size="lg"
                                    width={230}
                                    variant="warning"
                                    onClick={() => {
                                        history.push("user");
                                    }}
                                    disabled = {!loginUser.adminFlg}
                                >
                                    ユーザーマスタ
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
        </MainLayout>
    );
};
export default MainMenuPage;
