import React, { useEffect, useRef } from "react";
import {
    useObserver,
    useLocalStore
} from "mobx-react-lite";
import { storeContext } from "../Context";

import AppUtils, { ErrorResData } from "../utils/AppUtils";
import MoneyText from "../components/MoneyText";
import DatePicker from "../components/DatePicker";
import DecimalText from "../components/DecimalText";
import Button from "../components/Button";
import Row from "../components/Row";
import Label from "../components/Label";
import GridSamplePage, { GridHandler } from "./GridSamplePage";

/** @jsx jsx */
import { jsx, css } from "@emotion/core";
export const jsxBabelFix = jsx;

type InputSamplePageProp = {};

const InputSamplePage: React.FC<InputSamplePageProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = useLocalStore(() => ({
        moneyText: AppUtils.createInputStore<string>("金額"),
        datePicker: AppUtils.createInputStore<string>("日付"),
        decimalText: AppUtils.createInputStore<string>("小数"),
        async fileDownload() {
            let res = await AppUtils.postRequest<{
                fileName: string;
                fileData: string;
            }>("test/download");
            if (res instanceof ErrorResData) {
                await grobalStore!.showInvalidAlert(res, this);
                return;
            }
            AppUtils.downloadFile(res.fileData, res.fileName);
        }
    }));

    const childRef = useRef({} as GridHandler);

    return useObserver(() => (
        <div css={css({ padding: 30 })}>
            <Row>
                <Label>金額：</Label>
                <MoneyText
                    width={200}
                    {...AppUtils.createInputProp(store.moneyText)}
                />
                <Label>　数値：</Label>
                <DecimalText
                    width={200}
                    precision={5}
                    scale={2}
                    {...AppUtils.createInputProp(store.decimalText)}
                />
                <Label>　日付：</Label>
                <DatePicker
                    width={200}
                    {...AppUtils.createInputProp(store.datePicker)}
                />
            </Row>
            <br />
            <br />
            <Row>
                <Button
                    onClick={async () => {
                        await grobalStore!.showAlert({
                            Title: "TitleWork",
                            Body: <div>AlertBody</div>
                        });
                        console.log("Alert Clicked");
                    }}
                >
                    Alert Modal
                </Button>

                <Button
                    onClick={async () => {
                        if (
                            await grobalStore!.showConfirm({
                                Title: "TitleConfirm",
                                Body: <div>ConfirmBody</div>
                            })
                        ) {
                            console.log("Confirm Alert Clicked");
                        } else {
                            console.log("Confirm Cancel Clicked");
                        }
                    }}
                >
                    Confirm Modal
                </Button>

                <Button
                    onClick={async () => {
                        let bushoCode = await grobalStore!.showBushoSearchDialog();
                        console.log("bushoCode", bushoCode);
                    }}
                >
                    部署検索
                </Button>

                <Button
                    onClick={async () => {
                        let result = await grobalStore!.showBumonSearchDialog();
                        console.log("bumonResult", result);
                    }}
                >
                    部門検索
                </Button>

                <Button
                    onClick={async () => {
                        let result = await grobalStore!.showTeamSearchDialog();
                    }}
                >
                    チーム検索
                </Button>
                <Button
                    onClick={async () => {
                        let result = await grobalStore!.showUserSearchDialog();
                        console.log("userResult", result);
                    }}
                >
                    ユーザー検索
                </Button>
            </Row>
            <br />
            <br />
            <Row>
                <Button
                    onClick={async () => {
                        let result = await grobalStore!.showTorihikisakiSearchDialog(
                            {
                                kbn: "MH"
                            }
                        );
                        console.log("torihikisakiResult", result);
                    }}
                >
                    取引先検索(MH)
                </Button>
                <Button
                    onClick={async () => {
                        let result = await grobalStore!.showTorihikisakiSearchDialog(
                            {
                                kbn: "OTHER"
                            }
                        );
                        console.log("torihikisakiResult", result);
                    }}
                >
                    取引先検索(社外)
                </Button>
                <Button
                    onClick={async () => {
                        let result = await grobalStore!.showBranchSearchDialog();
                        console.log("branchResult", result);
                    }}
                >
                    MH支店
                </Button>

                <Button
                    onClick={async () => {
                        let result = await grobalStore!.showOrderItemSearchDialog();
                        console.log("orderItemResult", result);
                    }}
                >
                    発注項目
                </Button>
                <Button
                    onClick={async () => {
                        store.fileDownload();
                    }}
                >
                    ファイルダウンロード
                </Button>
            </Row>
            <br />
            <br />

            <GridSamplePage ref={childRef} />
        </div>
    ));
};
export default InputSamplePage;
