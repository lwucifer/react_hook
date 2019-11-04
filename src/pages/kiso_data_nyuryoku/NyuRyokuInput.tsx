import React, {useEffect} from "react";
import Button from "../../components/Button";
import Row from "../../components/Row";
import Label from "../../components/Label";
import Text from "../../components/Text";
import "free-jqgrid";
import "free-jqgrid/dist/i18n/grid.locale-ja";

/** @jsx jsx */
import {jsx, css} from "@emotion/core";
import {useLocalStore, useObserver} from "mobx-react-lite";
import {
    checkTaxRate,
    clearInvalidProp, covertToInt,
    createInputProp,
    createInputStore,
    createInputValueObject,
    ErrorResData, formatDate,
    postRequest, removeComma, separateByComma, setData2Store
} from "../../utils/AppUtils";
import {storeContext} from "../../Context";
import DatePicker from "../../components/DatePicker";
import {NyuRyokuPageStore} from "./NyuRyokuPage";
import {SelectStr} from "../../components/Select";

export const jsxBabelFix = jsx;

type KisoListProp = {
    parentStore: NyuRyokuPageStore;
};

type NyuRyoku = {
    id: number;
    kbn: string;
    kbnName: string;
    juchuKingakuZeiKomi: string;
    juchuKingakuZeiKomiTemp: string;
    juchuKingakuZeiNuki: string;
    juchuKingakuZeiNukiTemp: string;
    taxRate: string;
    uriageYoteiYm: string;
    uriageTantoId: string;
    uriageTeamCode: string;
    uriageTeamName: string;
    uriageTantoName: string;
    juchuTantoId: string;
    juchuTeamCode: string;
    juchuTeamName: string;
    juchuTantoName: string;
    tousu: string;
    juchuYm: string;
    constructionId: string;
    constName: string;
    orderNo: string;
    hatchumotoCode: string;
    hatchumotoSecCode: string;
    hatchumotoName: string;
    orderItemCode: string;
    orderItemName: string;
    branchName: string;
    mishunyuKingaku: string;

    nyukinDate1: string;
    nyukinDate2: string;
    nyukinKingaku1: string;
    nyukinKingaku2: string;
    nyukinKingaku1Temp: string;
    nyukinKingaku2Temp: string;
    seikyuDate1: string;
    seikyuDate2: string;
    seikyuKingaku1: string;
    seikyuKingaku2: string;
    seikyuKingaku1Temp: string;
    seikyuKingaku2Temp: string;
    labelName: string;
    planner: string;
    biko: string;
    kaikeiCode: string;
    constDetailNo: string;
    uriageKamoku: string;
    motoTaxRate: string;
    uriageDate: string;
    juchuBumonCode: string;
    juchuBushoCode: string;
    uriageBumonCode: string;
    uriageBushoCode: string;
    uriageFlg: string;
    yotoKbnName: string;
    nyukinSeq1: string;
    nyukinSeq2: string;
    seikyuSeq1: string;
    seikyuSeq2: string;
    loaded: boolean;
};

const conditionBlock = css({
    padding: 10,
    display: "inline-block",
    verticalAlign: "top"
});

const NyuRyokuInput: React.FC<KisoListProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = useLocalStore(() => ({
        id: 0,
        kbn: createInputStore<string>("区分"),
        juchuKingakuZeiKomi: createInputStore<string>("受注金額（税込）"),
        juchuKingakuZeiKomiTemp: '',
        juchuKingakuZeiNuki: createInputStore<string>("受注金額（税抜）"),
        juchuKingakuZeiNukiTemp: '',
        taxRate: createInputStore<string>("税率"),
        uriageYoteiYm: createInputStore<string>("売上予定年月"),
        uriageTantoId: createInputStore<string>("売上担当者"),
        uriageTeamCode: createInputStore<string>("売上チーム"),
        uriageTeamName: createInputStore<string>(""),
        uriageTantoName: createInputStore<string>("売上担当者"),
        juchuTantoId: createInputStore<string>("受注担当者"),
        juchuTeamCode: createInputStore<string>("受注チーム"),
        juchuTeamName: createInputStore<string>(""),
        juchuTantoName: createInputStore<string>("受注担当者"),
        tousu: createInputStore<string>("棟数"),
        juchuYm: createInputStore<string>("受注年月"),
        constName: createInputStore<string>("邸名"),
        constNo: createInputStore<string>("工事番号"),
        orderNo: createInputStore<string>("発注番号"),
        hatchumotoCode: createInputStore<string>("発注元コード"),
        hatchumotoSecCode: createInputStore<string>("発注元コード"),
        hatchumotoName: createInputStore<string>("発注元名"),
        orderItemCode: createInputStore<string>("発注項目コード"),
        orderItemName: createInputStore<string>("発注項目名称"),
        branchName: createInputStore<string>("部署コード"),
        mishunyuKingaku: createInputStore<string>("未収入金額"),
        mishunyuKingakuTemp: '',

        nyukinDate1: createInputStore<string>("入金日1"),
        nyukinDate2: createInputStore<string>("入金日2"),
        nyukinKingaku1: createInputStore<string>("入金金額1"),
        nyukinKingaku2: createInputStore<string>("入金金額2"),
        nyukinKingaku1Temp: '',
        nyukinKingaku2Temp: '',
        seikyuDate1: createInputStore<string>("請求日1"),
        seikyuDate2: createInputStore<string>("請求日2"),
        seikyuKingaku1: createInputStore<string>("請求金額1"),
        seikyuKingaku2: createInputStore<string>("請求金額2"),
        seikyuKingaku1Temp: '',
        seikyuKingaku2Temp: '',
        labelName: createInputStore<string>("支店・事業所"),
        planner: createInputStore<string>("プランナー"),
        biko: createInputStore<string>("備考"),
        kaikeiCode: createInputStore<string>("会計コード"),
        constDetailNo: createInputStore<string>("工事番号"),
        uriageKamoku: createInputStore<string>(""),
        motoTaxRate: createInputStore<string>(""),
        uriageDate: createInputStore<string>("売上日"),
        juchuBumonCode: createInputStore<string>(""),
        juchuBushoCode: createInputStore<string>(""),
        uriageBumonCode: createInputStore<string>(""),
        uriageBushoCode: createInputStore<string>(""),
        uriageFlg: createInputStore<string>("売上"),
        uriageFlgTemp: '',
        yotoKbnName: createInputStore<string>("用途区分名"),
        kbnName: '',
        nyukinSeq1: createInputStore<string>(""),
        nyukinSeq2: createInputStore<string>(""),
        seikyuSeq1: createInputStore<string>(""),
        seikyuSeq2: createInputStore<string>(""),
        loaded: false,

        async validate(sendData: { kisoDataNyuRyoku: NyuRyoku }) {
            const validateRes = await postRequest<{ token: string }>(
                "kisoDataNyuRyoku/validate",
                sendData
            );
            if (validateRes instanceof ErrorResData) {
                await grobalStore!.showInvalidAlert(validateRes, this);
                return false;
            }
            return true;
        },

        async validateDelete(sendData: { kisoDataNyuRyoku: NyuRyoku }) {
            const validateRes = await postRequest<{ token: string }>(
                "kisoDataNyuRyoku/validateDelete",
                sendData
            );
            if (validateRes instanceof ErrorResData) {
                await grobalStore!.showInvalidAlert(validateRes, this);
                return false;
            }
            return true;
        },

        async save() {
            clearInvalidProp(this);
            let sendData = {
                kisoDataNyuRyoku: Object.assign(
                    {id: store.id},
                    createInputValueObject(this)
                )
            };

            if (!(await this.validate(sendData))) {
                return;
            }

            if (!(await grobalStore!.showConfirm("部署情報を更新します。よろしいですか？"))) {
                return;
            }

            const updateRes = await postRequest<{ token: string }>(
                "kisoDataNyuRyoku/update",
                sendData
            );
            if (updateRes instanceof ErrorResData) {
                await grobalStore!.showInvalidAlert(updateRes, this);
                return;
            }
            await grobalStore!.showAlert("部署情報を更新しました。");
            prop.parentStore.setMode("list", true);
        },

        async delete() {
            clearInvalidProp(this);
            let valsendData = {
                kisoDataNyuRyoku: Object.assign(
                    {id: store.id},
                    createInputValueObject(this)
                )
            };

            if (!(await this.validateDelete(valsendData))) {
                return;
            }

            if (!(await grobalStore!.showConfirm("部署情報を削除します。よろしいですか？"))) {
                return;
            }

            const deleteRes = await postRequest<{ token: string }> (
                "kisoDataNyuryoku/delete",
                valsendData
            );
            if (deleteRes instanceof ErrorResData) {
                await grobalStore!.showInvalidAlert(deleteRes, this);
                return;
            }
            await grobalStore!.showAlert("部署情報を削除しました。");
            prop.parentStore.setMode("list", false);
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
            store.culMishunyuKingaku();
        },

        async culMishunyuKingaku() {
            let kingaku1 = store.nyukinKingaku1.value ? covertToInt(store.nyukinKingaku1.value) : 0;
            let kingaku2 = store.nyukinKingaku2.value ? covertToInt(store.nyukinKingaku2.value) : 0;
            let komi = store.juchuKingakuZeiKomi.value ? covertToInt(store.juchuKingakuZeiKomi.value) : 0;
            let result = komi - kingaku1 - kingaku2;
            store.mishunyuKingakuTemp = result ? separateByComma(result) : '0';
            store.mishunyuKingaku.value = String(result);
        },

        cancel() {
            prop.parentStore.setMode("list", false);
        },

        check(value: any) {
            //if (store.kbn.value === '0') return true;
            if (value && value !== '0' && value !== '-') return false;
            return true;
        }
    }));

    useEffect(() => {
        if (store.loaded === false) {
            store.loaded = true;
            (async () => {
                var res = await postRequest<{ kisoDataNyuRyoku: NyuRyoku; }>(
                    "kisoDataNyuryoku/sentaku",
                    prop.parentStore.param
                );
                if (res instanceof ErrorResData) {
                    grobalStore!.showInvalidAlert(res, store);
                } else {
                    let nyuRyoku = res.kisoDataNyuRyoku;
                    setData2Store(store, nyuRyoku);
                    store.juchuKingakuZeiKomiTemp = separateByComma(covertToInt(nyuRyoku.juchuKingakuZeiKomi));
                    store.juchuKingakuZeiNukiTemp = separateByComma(covertToInt(nyuRyoku.juchuKingakuZeiNuki));
                    store.uriageYoteiYm!.value = formatDate(nyuRyoku.uriageYoteiYm, 'yyyymm');
                    store.juchuYm!.value = formatDate(nyuRyoku.juchuYm, 'yyyymm');
                    store.nyukinDate1!.value = formatDate(nyuRyoku.nyukinDate1, 'yyyy/mm/dd');
                    store.nyukinDate2!.value = formatDate(nyuRyoku.nyukinDate2, 'yyyy/mm/dd');
                    store.nyukinKingaku1Temp = separateByComma(covertToInt(nyuRyoku.nyukinKingaku1));
                    store.nyukinKingaku2Temp = separateByComma(covertToInt(nyuRyoku.nyukinKingaku2));
                    store.seikyuDate1!.value = formatDate(nyuRyoku.seikyuDate1, 'yyyy/mm/dd');
                    store.seikyuDate2!.value = formatDate(nyuRyoku.seikyuDate2, 'yyyy/mm/dd');
                    store.seikyuKingaku1Temp = separateByComma(covertToInt(nyuRyoku.seikyuKingaku1));
                    store.seikyuKingaku2Temp = separateByComma(covertToInt(nyuRyoku.seikyuKingaku2));
                    store.mishunyuKingakuTemp = separateByComma(covertToInt(nyuRyoku.mishunyuKingaku));
                    store.uriageDate!.value = formatDate(nyuRyoku.uriageDate, 'yyyy/mm/dd');
                    store.uriageFlgTemp = nyuRyoku.uriageFlg;
                    if (nyuRyoku.kbn === '1') store.labelName!.value = '';
                    store.culMishunyuKingaku();
                }
            })();
            store.loaded = true;
        }
    });

    return useObserver(() => (
        <div>
            <div className={'table max-w'}>
                <div css={conditionBlock} className={'form p-0 w-50'}>
                    <Row>
                        <Label width={135}>区分</Label>
                        <Text width={150} value={store.kbnName} readOnly={true}/>
                    </Row>
                    <Row>
                        <Label width={135}>受注チーム</Label>
                        <Text width={200} {...createInputProp(store.juchuTeamName!)} readOnly={true}/>
                    </Row>
                    <Row>
                        <Label width={135}>売上チーム</Label>
                        <Text width={200} {...createInputProp(store.uriageTeamName!)} readOnly={true}/>
                    </Row>
                    <Row>
                        <Label width={135}>邸名</Label>
                        <Text width={200} maxLength={40} {...createInputProp(store.constName!)}/>
                    </Row>
                    <Row>
                        <Label width={135}>受注年月</Label>
                        <DatePicker {...createInputProp(store.juchuYm)}/>
                    </Row>
                    <Row>
                        <Label width={135}>発注番号</Label>
                        <Text width={100} {...createInputProp(store.orderNo!)} readOnly={true}/>
                    </Row>
                    <Row>
                        <Label width={135}>受注金額（税抜）</Label>
                        <Text width={100} value={store.juchuKingakuZeiNukiTemp}
                              isInvalid={store.juchuKingakuZeiNuki.isInvalid}
                              onChange={async (e) => {
                                  let num = removeComma(e);
                                  let com = separateByComma(covertToInt(num));
                                  store.juchuKingakuZeiNuki.value = num;
                                  store.juchuKingakuZeiNukiTemp = com;
                                  store.setValueKomi(num, store.taxRate.value);
                              }}
                        />
                    </Row>
                </div>
                <div css={conditionBlock} className={'form p-0'}>
                    <Row>
                        <Label width={135} className={store.kbn.value === '2' ? 'disabled' : ''}>発注元</Label>
                        <Text width={200} {...createInputProp(store.hatchumotoName!)} readOnly={true}
                              isInvalid={store.hatchumotoCode.isInvalid}/>
                        <Button
                            className={store.kbn.value === '2' ? 'disabled fa fa-search' : 'fa fa-search'}
                            onClick={async () => {
                                if (store.kbn!.value != "0") {
                                    const ret = await grobalStore!.showTorihikisakiSearchDialog({kbn: "OTHER"});
                                    if (ret) {
                                        store.hatchumotoCode!.value = ret.torihikisakiCode;
                                        store.hatchumotoName!.value = ret.torihikisakiName;
                                    }
                                } else {
                                    const ret = await grobalStore!.showBuyerSearchDialog({kbn: "MH"});
                                    if (ret) {
                                        store.hatchumotoCode!.value = ret.buyerCd;
                                        store.hatchumotoName!.value = ret.buyerAbbrName;
                                    }
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
                        <Label width={135}>受注担当者</Label>
                        <Text width={200} {...createInputProp(store.juchuTantoName!)} readOnly={true}/>
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showUserSearchDialog();
                                if (ret) {
                                    store.juchuTeamCode!.value = ret.teamCode;
                                    store.juchuTeamName!.value = ret.teamName;
                                    store.juchuTantoId!.value = ret.userId;
                                    store.juchuTantoName!.value = ret.userName;
                                    store.juchuBumonCode!.value = ret.bumonCode;
                                    store.juchuBushoCode!.value = ret.bushoCode;
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.juchuTeamCode!.value = '';
                                    store.juchuTeamName!.value = '';
                                    store.juchuTantoId!.value = '';
                                    store.juchuTantoName!.value = '';
                                    store.juchuBumonCode!.value = '';
                                    store.juchuBushoCode!.value = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={135}>売上担当者</Label>
                        <Text width={200} {...createInputProp(store.uriageTantoName!)} readOnly={true}/>
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showUserSearchDialog();
                                if (ret) {
                                    store.uriageTeamCode!.value = ret.teamCode;
                                    store.uriageTeamName!.value = ret.teamName;
                                    store.uriageTantoId!.value = ret.userId;
                                    store.uriageTantoName!.value = ret.userName;
                                    store.uriageBumonCode!.value = ret.bumonCode;
                                    store.uriageBushoCode!.value = ret.bushoCode;
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.uriageTeamCode!.value = '';
                                    store.uriageTeamName!.value = '';
                                    store.uriageTantoId!.value = '';
                                    store.uriageTantoName!.value = '';
                                    store.uriageBumonCode!.value = '';
                                    store.uriageBushoCode!.value = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={135} className={store.kbn.value === '0' ? 'disabled' : ''}>支店・事業所</Label>
                        <Text width={200} {...createInputProp(store.labelName!)} readOnly={true}/>
                        <Button
                            className={store.kbn.value === '0' ? 'disabled fa fa-search' : 'fa fa-search'}
                            onClick={async () => {
                                const ret = await grobalStore!.showBranchSearchDialog();
                                if (ret) {
                                    store.labelName!.value = ret.labelName;
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.labelName!.value = '';
                                }}
                        >取消</Button>
                        <Label width={135} marginLeft={23}>発注項目名称</Label>
                        <Text width={100} {...createInputProp(store.orderItemName!)} readOnly={true}/>
                    </Row>
                    <Row>
                        <Label width={135}>売上予定年月</Label>
                        <DatePicker {...createInputProp(store.uriageYoteiYm)}/>
                        <Label marginLeft={120} width={135}>棟数</Label>
                        <Text width={50} maxLength={2} {...createInputProp(store.tousu!)}/>
                    </Row>
                    <Row>
                        <Label width={135}>工事番号</Label>
                        <Text width={100} maxLength={8} value={store.constNo!.value} readOnly={true}/>
                        <span className={'ml-1 mr-2'}>-</span>
                        <Text width={50} maxLength={2} value={store.constDetailNo!.value} readOnly={true}/>
                    </Row>
                    <Row>
                        <Label width={135}>受注金額（税込）</Label>
                        <Text width={100} value={store.juchuKingakuZeiKomiTemp} readOnly={true}
                              isInvalid={store.juchuKingakuZeiKomi.isInvalid}
                        />
                        <Label width={135} marginLeft={165}>税率</Label>
                        <Text maxLength={2} width={50} {...createInputProp(store.taxRate!)}
                              onBlur={async (e) => {
                                  checkTaxRate(e, store, grobalStore);
                                  store.setValueKomi(store.juchuKingakuZeiNuki.value, e);
                              }}
                        />
                        <span>%</span>
                    </Row>
                </div>
            </div>
            <div>
                <table className={'table table-bordered w-50'}>
                    <thead>
                    <tr>
                        <td className={'w40'}/>
                        <td className={'bg-default h40'}>請求日</td>
                        <td className={'bg-default'}>請求金額</td>
                        <td className={'bg-default'}>入金日</td>
                        <td className={'bg-default'}>入金金額</td>
                        <td className={'bg-default'}>未収入金額</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className={'bg-default'}>1</td>
                        <td>
                            {!store.check(store.nyukinKingaku1Temp && store.seikyuSeq1.value === '1') ? (
                                <DatePicker {...createInputProp(store.seikyuDate1)} type={'date'}/>
                            ) : (
                                <Text value={store.seikyuDate1!.value} readOnly={true}/>
                            )}
                        </td>
                        <td>
                            <Text value={store.seikyuKingaku1Temp}
                                  isInvalid={store.seikyuKingaku1.isInvalid}
                                  readOnly={store.check(store.nyukinKingaku1Temp) || store.seikyuSeq1.value !== '1'}
                                  onChange={async (e) => {
                                      let num = removeComma(e);
                                      let com = separateByComma(covertToInt(num));
                                      store.seikyuKingaku1.value = com ? num : '';
                                      store.seikyuKingaku1Temp = com;
                                      if (store.seikyuKingaku1.value === '0') store.seikyuDate1.value = '';
                                  }}
                            />
                        </td>
                        <td>
                            {store.kbn.value !== '0' ? (
                                <DatePicker {...createInputProp(store.nyukinDate1)} type={'date'}/>
                            ) : (
                                <Text value={store.nyukinDate1!.value} readOnly={true}/>
                            )}
                        </td>
                        <td>
                            <Text value={store.nyukinKingaku1Temp}
                                  isInvalid={store.nyukinKingaku1.isInvalid}
                                  readOnly={store.kbn.value === '0'}
                                  onChange={async (e) => {
                                      let num = removeComma(e);
                                      let com = separateByComma(covertToInt(num));
                                      store.nyukinKingaku1.value = com ? num : '';
                                      store.nyukinKingaku1Temp = com;
                                      store.culMishunyuKingaku();
                                      if (store.nyukinKingaku1.value === '0') store.nyukinDate1.value = '';
                                  }}
                            />
                        </td>
                        <td className={'border-bottom-hidden'}/>
                    </tr>
                    <tr>
                        <td className={'bg-default'}>2</td>
                        <td>
                            {!store.check(store.nyukinKingaku2Temp && store.seikyuSeq2.value === '2') ? (
                                <DatePicker {...createInputProp(store.seikyuDate2)} type={'date'}/>
                            ) : (
                                <Text value={store.seikyuDate2!.value} readOnly={true}/>
                            )}
                        </td>
                        <td>
                            <Text value={store.seikyuKingaku2Temp}
                                  isInvalid={store.seikyuKingaku2.isInvalid}
                                  readOnly={store.check(store.nyukinKingaku2Temp) || store.seikyuSeq2.value !== '2'}
                                  onChange={async (e) => {
                                      let num = removeComma(e);
                                      let com = separateByComma(covertToInt(num));
                                      store.seikyuKingaku2.value = com ? num : '';
                                      store.seikyuKingaku2Temp = com;
                                      store.culMishunyuKingaku();
                                      if (store.seikyuKingaku2.value === '0') store.seikyuDate2.value = '';
                                  }}
                            />
                        </td>
                        <td>
                            {(store.kbn.value !== '0') ? (
                                <DatePicker {...createInputProp(store.nyukinDate2)} type={'date'}/>
                            ) : (
                                <Text value={store.nyukinDate2!.value} readOnly={true}/>
                            )}
                        </td>
                        <td>
                            <Text value={store.nyukinKingaku2Temp}
                                  isInvalid={store.nyukinKingaku2.isInvalid}
                                  readOnly={store.kbn.value === '0'}
                                  onChange={async (e) => {
                                      let num = removeComma(e);
                                      let com = separateByComma(covertToInt(num));
                                      store.nyukinKingaku2.value = com ? num : '';
                                      store.nyukinKingaku2Temp = com;
                                      store.culMishunyuKingaku();
                                      if (store.nyukinKingaku2.value === '0') store.nyukinDate2.value = '';
                                  }}
                            />
                        </td>
                        <td className={'border-top-hidden'}>
                            <Text value={store.mishunyuKingakuTemp} readOnly={true}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className={'table max-w'}>
                <div css={conditionBlock} className={'form p-0 w-50'}>
                    <Row>
                        <Label width={135}>売上</Label>
                        { store.uriageFlgTemp ? (
                            <React.Fragment>
                                <SelectStr
                                    width={100}
                                    items={[
                                        {label: '', value: 'false'},
                                        {label: '売上計上済', value: 'true'}
                                    ]}
                                    {...createInputProp(store.uriageFlg)}
                                />
                                <DatePicker {...createInputProp(store.uriageDate)} type={'date'}/>
                            </React.Fragment>
                        ):(
                            <React.Fragment>
                                <Text width={100} readOnly={true}/>
                                <Text width={100} readOnly={true} {...createInputProp(store.uriageDate!)}/>
                            </React.Fragment>
                        )}

                    </Row>
                    <Row>
                        <Label width={135}>備考</Label>
                        <Text width={350} maxLength={200} {...createInputProp(store.biko!)}/>
                    </Row>
                    <Row>
                        <Label width={135}>会計コード</Label>
                        <Text width={150} maxLength={10} {...createInputProp(store.kaikeiCode!)}/>
                    </Row>
                    <Row>
                        <Label width={135}>プランナー</Label>
                        <Text width={200} maxLength={10} {...createInputProp(store.planner!)}/>
                    </Row>
                </div>
                <div css={conditionBlock} className={'form p-0'}>
                    <Row>
                        <span className={'h40'}/>
                    </Row>
                    <Row>
                        <span className={'h40'}/>
                    </Row>
                    <Row>
                        <Label width={135}>売上科目</Label>
                        <Text maxLength={1} width={150} {...createInputProp(store.uriageKamoku!)}/>
                        <Label width={135} marginLeft={115}>元税率</Label>
                        <Text maxLength={2} width={50} {...createInputProp(store.motoTaxRate!)}/>
                        <span>%</span>
                    </Row>
                    <Row>
                        <Label width={135}>用途区分</Label>
                        <Text width={200} {...createInputProp(store.yotoKbnName!)} readOnly={true}/>
                    </Row>
                </div>
            </div>
            <Row>
                <Button onClick={store.save} className="ml-auto">更新</Button>
                <Button variant="dark" onClick={store.delete}>削除</Button>
                <Button variant="secondary" onClick={store.cancel}>キャンセル</Button>
            </Row>
        </div>
    ));
};

export default NyuRyokuInput;
