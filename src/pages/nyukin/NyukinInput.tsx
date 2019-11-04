import React, {useEffect, useRef} from "react";
import Button from "../../components/Button";
import Row from "../../components/Row";
import Label from "../../components/Label";
import "free-jqgrid";
import "free-jqgrid/dist/i18n/grid.locale-ja";

/** @jsx jsx */
import {jsx} from "@emotion/core";
import DataGrid, {GridHandler} from "../../components/DataGrid";
import {useLocalStore, useObserver} from "mobx-react-lite";
import {
    covertToInt,
    createInputStore,
    createInputValueObject, download,
    ErrorResData, formatDate,
    postRequest, separateByComma
} from "../../utils/AppUtils";
import {storeContext} from "../../Context";
import {NyukinPageStore} from "./NyukinPage";
import $ from "jquery";

export const jsxBabelFix = jsx;

type NyukinProp = {
    parentStore: NyukinPageStore;
};

const NyukinInputPage: React.FC<NyukinProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const gridRef = useRef({} as GridHandler);
    const store = useLocalStore(() => ({
        content: 0,
        shitenCode: createInputStore<string>(""),
        hatchumotoCode: createInputStore<string>(""),
        nyukinKingaku: '',
        shitenName: '',
        shiharaiYm: '',
        nyukinYm: createInputStore<string>(""),
        sosaigaku: '0',
        bil: '',
        loaded: false,

        async save() {
            const updates = await postRequest<{ token: string }>(
                "nyukinTorikomi/uchiwakeList",
            );
            if (updates instanceof ErrorResData) {
                await grobalStore!.showInvalidAlert(updates, this);
                return;
            }
            await grobalStore!.showAlert("部署情報を更新しました。");
        },
    }));

    useEffect(() => {
        if (!store.loaded) {
            store.shitenCode.value = String(prop.parentStore.param.shitenCode);
            store.hatchumotoCode.value = prop.parentStore.param.hatchumotoCode;
            store.nyukinKingaku = String(prop.parentStore.param.nyukinKingaku);
            store.shitenName = prop.parentStore.param.shitenName;
            store.nyukinYm.value = prop.parentStore.param.nyukinYm;
            store.sosaigaku = String(prop.parentStore.param.sosaigaku);
            store.bil = String(prop.parentStore.param.nyukinKingaku - prop.parentStore.param.sosaigaku);
            store.content = 1;
            store.loaded = true;

            let kaikeiKikan = prop.parentStore.param.kaikeiKikan;
            let kaikeiNendo = prop.parentStore.param.kaikeiNendo;
            let CurrentDate = new Date(kaikeiNendo + '/' + kaikeiKikan + '/05');
            CurrentDate.setMonth(CurrentDate.getMonth() + 3);
            let space = CurrentDate.getMonth() < 9 ? '/0' : '/';
            store.shiharaiYm = CurrentDate.getFullYear() + space + (CurrentDate.getMonth() + 1);
        }
    });

    return useObserver(() => (
        <div>
            <div className={'table p-0 max-w'}>
                <div className={'form'}>
                    <Row>
                        <Label width={120}>支店</Label>
                        <span>{store.shitenName}</span>
                    </Row>
                </div>
                <div className={'form'}>
                    <Row>
                        <Label width={120}>年月</Label>
                        <span>{store.shiharaiYm}</span>
                    </Row>
                </div>
                <div className={'form'}>
                    <Row>
                        <Label width={120}>入金年月</Label>
                        <span>{store.nyukinYm.value}</span>
                    </Row>
                </div>
            </div>
            <div className={'form p-0'}>
                <Row>
                    <Label width={120}>当月入金額計</Label>
                    <span className={'w-200 text-right'}>{separateByComma(covertToInt(store.nyukinKingaku))}</span>
                </Row>
                <Row>
                    <Label width={120}>相殺額計</Label>
                    <span className={'w-200 text-right'}>{store.sosaigaku ? separateByComma(covertToInt(store.sosaigaku)) : '0'}</span>
                </Row>
                <Row>
                    <Label width={120}>差引当月入金額</Label>
                    <span className={'w-200 text-right'}>{separateByComma(covertToInt(store.bil))}</span>
                </Row>
            </div>
            <hr/>
            <div className={'wrapper-grid'}>
                <div className={'switch'}>
                    <Button size={'lg'} className={store.content === 1 ? 'btn-switch active' : 'btn-switch '}
                            onClick={async () => {
                                store.content = 1;
                            }}
                    >入金内訳</Button>
                    <Button size={'lg'} className={store.content === 2 ? 'btn-switch active' : 'btn-switch'}
                            onClick={async () => {
                                store.content = 2;
                            }}
                    >相殺額明細</Button>
                </div>
                <div className={'content'}>
                    {store.content === 1 &&
                    <div>
                        <label>金額：税込</label>
                        <DataGrid
                            ref={gridRef}
                            apiPath="nyukinTorikomi/uchiwakeList"
                            options={{
                                datatype: "json",
                                colModel: [
                                    {
                                        label: "発注番号",
                                        name: "orderNo",
                                        width: 100,
                                    },
                                    {
                                        label: "工事番号",
                                        name: "constNo",
                                        width: 100,
                                        formatter: function (cellValue, opt, row) {
                                            return cellValue + '-' + row.constDetailNo;
                                        }

                                    },
                                    {
                                        label: "工事邸名",
                                        name: "constName",
                                        width: 100,
                                    },
                                    {
                                        label: "発注項目",
                                        name: "orderItemName",
                                        width: 100,
                                    },
                                    {
                                        label: "受注金額",
                                        name: "juchuKingakuZeiKomi",
                                        width: 100,
                                        sorttype: "number",
                                        formatter: function (cellValue) {
                                            return cellValue ? separateByComma(cellValue) : '';
                                        }
                                    },
                                    {
                                        label: "請求日",
                                        name: "seikyuDate",
                                        width: 100,
                                        formatter: function (cellValue) {
                                            return cellValue ? formatDate(cellValue.replace('/',''), 'yyyy/mm/dd') : '';
                                        }
                                    },
                                    {
                                        label: "請求金額",
                                        name: "seikyuKingakuZeiKomi",
                                        width: 100,
                                        sorttype: "number",
                                        formatter: function (cellValue) {
                                            return cellValue ? separateByComma(cellValue) : '';
                                        }
                                    },
                                    {
                                        label: "入金日",
                                        name: "nyukinDate",
                                        width: 100,
                                        formatter: function (cellValue) {
                                            return cellValue ? formatDate(cellValue.replace('/',''), 'yyyy/mm/dd') : '';
                                        }
                                    },
                                    {
                                        label: "入金金額",
                                        name: "nyukinKingaku",
                                        width: 100,
                                        sorttype: "number",
                                        formatter: function (cellValue) {
                                            return cellValue ? separateByComma(cellValue) : '';
                                        }
                                    },
                                    {
                                        label: "未収入金額",
                                        name: "mishunyuKingaku",
                                        width: 100,
                                        sorttype: "number",
                                        formatter: function (cellValue) {
                                            return cellValue ? separateByComma(cellValue) : '';
                                        }
                                    },
                                    {name: "constDetailNo"},
                                ],
                                postData: createInputValueObject(store)
                            }}
                            onInitialized={(id: string) => {
                                let grid = $('#jqGrid' + id);
                                grid.jqGrid('hideCol', ['constDetailNo']);
                            }}
                        />

                        <div className={'text-right'}>
                            <Button size={'lg'} onClick={() => {
                                download('nyukinTorikomi/download/receipt', store, grobalStore)
                            }}>ダウンロード</Button>
                        </div>
                    </div>
                    }
                    {store.content === 2 &&
                    <div>
                        <div className={'w-800'}>
                            <DataGrid
                                ref={gridRef}
                                apiPath="nyukinTorikomi/uchiwakeListoffsetAmount"
                                options={{
                                    datatype: "json",
                                    colModel: [
                                        {
                                            label: "相殺金額明細",
                                            name: "sosaiMeisaiName",
                                            width: 150,
                                        },
                                        {
                                            label: "金額",
                                            name: "kingaku",
                                            width: 150,
                                            sorttype: "number",
                                            formatter: function (cellValue) {
                                                return cellValue ? separateByComma(cellValue) : '';
                                            }
                                        },
                                    ],
                                    postData: createInputValueObject(store)
                                }}
                            />
                        </div>
                        <div className={'text-right'}>
                            <Button size={'lg'} onClick={() => {
                                download('nyukinTorikomi/download/offsetAmount', store, grobalStore)
                            }}>ダウンロード</Button>
                        </div>
                    </div>
                    }
                </div>
            </div>
            <hr/>
            <div className={'text-right mb-4'}>
                <Button variant="secondary" size={'lg'} onClick={() => {
                    prop.parentStore.setMode("list");
                    store.loaded = false;
                }}>戻る</Button>
            </div>
        </div>
    ));
};

export default NyukinInputPage;
