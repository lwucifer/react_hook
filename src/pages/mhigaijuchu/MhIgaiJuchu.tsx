import React, {useEffect} from "react";
import Button from "../../components/Button";
import Row from "../../components/Row";
import Label from "../../components/Label";
import Text from "../../components/Text";
import MainLayout from "../../layouts/MainLayout";
import "free-jqgrid";
import "free-jqgrid/dist/i18n/grid.locale-ja";

/** @jsx jsx */
import {jsx, css} from "@emotion/core";
import {useLocalStore, useObserver} from "mobx-react-lite";
import {
    clearInvalidProp,
    createInputProp,
    createInputStore,
    createInputValueObject,
    ErrorResData,
    postRequest,
    covertToInt, separateByComma, removeComma, resetStore, checkTaxRate
} from "../../utils/AppUtils";
import {storeContext} from "../../Context";
import DatePicker from "../../components/DatePicker";

export const jsxBabelFix = jsx;

type MhIgaiJuchuProp = {};

const conditionBlock = css({
    padding: 10,
    display: "inline-block",
    verticalAlign: "top"
});

type MhIgaiJuchu = {};

const MhIgaiJuchu: React.FC<MhIgaiJuchuProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = useLocalStore(() => ({
        juchuKingakuZeiKomi: createInputStore<string>("受注金額（税込）"),
        juchuKingakuZeiKomiTemp: '',
        juchuKingakuZeiNuki: createInputStore<string>("受注金額（税抜）"),
        juchuKingakuZeiNukiTemp: '',
        taxRate: createInputStore<string>("税率"),
        uriageYoteiYm: createInputStore<string>("売上予定年月"),
        uriageTantoId: createInputStore<string>("売上担当者"),
        uriageTeamCode: createInputStore<string>("売上チーム"),
        uriageTeamName: createInputStore<string>(""),
        uriageUserName: createInputStore<string>("売上担当者"),
        juchuTantoId: createInputStore<string>("受注担当者"),
        juchuTeamCode: createInputStore<string>("受注チーム"),
        juchuTeamName: createInputStore<string>(""),
        juchuUserName: createInputStore<string>("受注担当者"),
        tousu: createInputStore<string>("棟数"),
        juchuYm: createInputStore<string>("受注年月"),
        constructionId: createInputStore<string>(""),
        constName: createInputStore<string>("邸名"),
        orderNo: createInputStore<string>("発注番号"),
        hatchumotoCode: createInputStore<string>("発注元コード"),
        hatchumotoName: createInputStore<string>("発注元名"),
        orderItemCode: createInputStore<string>("発注項目コード"),
        orderItemName: createInputStore<string>("発注項目名称"),
        branchName: createInputStore<string>("部署コード"),
        juchuBumonCode: createInputStore<string>(""),
        juchuBushoCode: createInputStore<string>(""),
        uriageBumonCode: createInputStore<string>(""),
        uriageBushoCode: createInputStore<string>(""),
        loaded: false,

        async validate(sendData: { mhIgaiJuchu: MhIgaiJuchu }) {
            const validateRes = await postRequest<{ token: string }>(
                "mhIgaiJuchu/validate",
                sendData
            );
            if (validateRes instanceof ErrorResData) {
                await grobalStore!.showInvalidAlert(validateRes, this);
                return false;
            }
            return true;
        },

        async create() {
            clearInvalidProp(this);
            let sendData = {
                mhIgaiJuchu: Object.assign(createInputValueObject(this))
            };

            if (!(await this.validate(sendData))) {
                return;
            }
            if (
                !(await grobalStore!.showConfirm(
                    "部署情報を登録します。よろしいですか？"
                ))
            ) {
                return;
            }
            const createRes = await postRequest<{ token: string }>(
                "mhIgaiJuchu/update",
                sendData
            );
            if (createRes instanceof ErrorResData) {
                await grobalStore!.showInvalidAlert(createRes, this);
                return;
            }
            await grobalStore!.showAlert("部署情報を登録しました。");

            resetStore(this);
            store.juchuKingakuZeiKomiTemp = '';
            store.juchuKingakuZeiNukiTemp = '';
            if(!store.orderNo.value) {
                store.getNextOder();
                store.getTaxRate();
            }
        },

        async setValueKomi(nuki: any, tax: any) {
            if (nuki && tax) {
                let com;
                let i = covertToInt(nuki) * (100 + covertToInt(tax)) / 100;
                store.juchuKingakuZeiKomiTemp = com = separateByComma(covertToInt(String(i)));
                store.juchuKingakuZeiKomi.value = removeComma(com);
            } else {
                store.juchuKingakuZeiKomiTemp = '';
                store.juchuKingakuZeiKomi.value = '';
            }
        },

        async getNextOder() {
            (async () => {
                let res = await postRequest<{ orderNo: string; }>(
                    "nextOrderNo",
                    {"type": "1"}
                );
                if (!(res instanceof ErrorResData)) {
                    store.orderNo.value = res.orderNo;
                }
            })();
        },

        async getTaxRate() {
            (async () => {
                let res = await postRequest<{ taxRate: string; }>(
                    "taxRate/getTaxRate",
                );
                if (!(res instanceof ErrorResData)) {
                    if (res.taxRate) store.taxRate.value = covertToInt(res.taxRate);
                }
            })();
        },
    }));

    useEffect(() => {
        if(!store.orderNo!.value && !store.loaded) {
            store.loaded = true;
            store.getNextOder();
            store.getTaxRate();
        }
    });

    return useObserver(() => (
        <MainLayout
            systemName="業務システム"
            tilte="MH以外受注データ入力"
        >
            <div className={'table max-w'}>
                <div css={conditionBlock} className={'form p-0'}>
                    <Row>
                        <Label width={135}>受注チーム</Label>
                        <Text width={200} {...createInputProp(store.juchuTeamName!)} readOnly={true}/>
                    </Row>
                    <Row>
                        <Label width={135}>売上チーム</Label>
                        <Text width={200} {...createInputProp(store.uriageTeamName!)} readOnly={true}/>
                    </Row>
                    <Row>
                        <Label width={135}>発注元</Label>
                        <Text width={200} {...createInputProp(store.hatchumotoName!)} readOnly={true} isInvalid={store.hatchumotoCode.isInvalid}/>
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showTorihikisakiSearchDialog({kbn:"OTHER"});
                                if (ret) {
                                    store.hatchumotoCode!.value = ret.torihikisakiCode;
                                    store.hatchumotoName!.value = ret.torihikisakiName;
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.hatchumotoCode!.value = '';
                                    store.hatchumotoName!.value = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={135}>邸名</Label>
                        <Text width={200} maxLength={40} {...createInputProp(store.constName!)}/>
                    </Row>
                    <Row>
                        <Label width={135}>発注番号</Label>
                        <Text width={100} {...createInputProp(store.orderNo!)} readOnly={true}/>
                    </Row>
                    <Row>
                        <Label width={135}>受注年月</Label>
                        <DatePicker {...createInputProp(store.juchuYm)}/>
                    </Row>
                    <Row>
                        <Label width={135}>受注金額（税抜）</Label>
                        <Text width={100} value={store.juchuKingakuZeiNukiTemp!} isInvalid={store.juchuKingakuZeiNuki.isInvalid}
                              onChange={async (e) => {
                                  let num = removeComma(e);
                                  let com = separateByComma(covertToInt(num));
                                  store.juchuKingakuZeiNuki.value = num;
                                  store.juchuKingakuZeiNukiTemp = com;
                                  store.setValueKomi(num, store.taxRate.value);
                              }}
                        />
                        <Label width={135} marginLeft={50}>税率</Label>
                        <Text maxLength={2} width={50} {...createInputProp(store.taxRate!)}
                            onBlur={async (e) => {
                                checkTaxRate(e, store, grobalStore);
                                store.setValueKomi(store.juchuKingakuZeiNuki.value, e);
                            }}
                        />
                        <span>%</span>
                    </Row>
                </div>
                <div css={conditionBlock} className={'form p-0'}>
                    <Row>
                        <Label width={135}>受注担当者：</Label>
                        <Text width={200} {...createInputProp(store.juchuUserName!)} readOnly={true}/>
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showUserSearchDialog();
                                if (ret) {
                                    store.juchuTeamCode!.value = ret.teamCode;
                                    store.juchuTeamName!.value = ret.teamName;
                                    store.juchuTantoId!.value = ret.userId;
                                    store.juchuUserName!.value = ret.userName;
                                    store.uriageTeamCode!.value = ret.teamCode;
                                    store.uriageTeamName!.value = ret.teamName;
                                    store.uriageTantoId!.value = ret.userId;
                                    store.uriageUserName!.value = ret.userName;
                                    store.uriageBushoCode!.value = ret.bushoCode;
                                    store.uriageBumonCode!.value = ret.bumonCode;
                                    store.juchuBushoCode!.value = ret.bushoCode;
                                    store.juchuBumonCode!.value = ret.bumonCode;
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.juchuTeamCode!.value = '';
                                    store.juchuTeamName!.value = '';
                                    store.juchuTantoId!.value = '';
                                    store.juchuUserName!.value = '';
                                    store.juchuBushoCode!.value = '';
                                    store.juchuBumonCode!.value = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={135}>売上担当者：</Label>
                        <Text width={200} {...createInputProp(store.uriageUserName!)} readOnly={true}/>
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showUserSearchDialog();
                                if (ret) {
                                    store.uriageTeamCode!.value = ret.teamCode;
                                    store.uriageTeamName!.value = ret.teamName;
                                    store.uriageTantoId!.value = ret.userId;
                                    store.uriageUserName!.value = ret.userName;
                                    store.uriageBushoCode!.value = ret.bushoCode;
                                    store.uriageBumonCode!.value = ret.bumonCode;
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.uriageTeamCode!.value = '';
                                    store.uriageTeamName!.value = '';
                                    store.uriageTantoId!.value = '';
                                    store.uriageUserName!.value = '';
                                    store.uriageBushoCode!.value = '';
                                    store.uriageBumonCode!.value = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row><span className={'h40'}/></Row>
                    <Row>
                        <Label width={135}>棟数</Label>
                        <Text width={50} maxLength={2} {...createInputProp(store.tousu!)}/>
                    </Row>
                    <Row>
                        <Label width={135}>発注項目名称</Label>
                        <Text width={100} {...createInputProp(store.orderItemName!)} readOnly={true}/>
                        <Button
                            className="fa fa-search mr-5px"
                            onClick={async () => {
                                const ret = await grobalStore!.showOrderItemSearchDialog();
                                if (ret) {
                                    store.orderItemName!.value = ret.orderItemName;
                                    store.orderItemCode!.value = ret.orderItemCode;
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.orderItemName!.value = '';
                                    store.orderItemCode!.value = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={135}>売上予定年月</Label>
                        <DatePicker {...createInputProp(store.uriageYoteiYm)}/>
                    </Row>
                    <Row>
                        <Label width={135}>受注金額（税込）</Label>
                        <Text width={100} value={store.juchuKingakuZeiKomiTemp!} readOnly={true} isInvalid={store.juchuKingakuZeiKomi.isInvalid}/>
                    </Row>
                </div>
            </div>
            <Button size="lg" onClick={store.create} className={'float-right'}>更新</Button>
        </MainLayout>
    ));
};

export default MhIgaiJuchu;
