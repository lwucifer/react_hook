import React, {useEffect, useRef} from "react";
import Button from "../../components/Button";
import Row from "../../components/Row";
import Label from "../../components/Label";
import moment from 'moment';
import $ from "jquery";
import "free-jqgrid";
import "free-jqgrid/dist/i18n/grid.locale-ja";

/** @jsx jsx */
import {jsx, css} from "@emotion/core";
import DataGrid, {GridHandler} from "../../components/DataGrid";
import {useLocalStore, useObserver} from "mobx-react-lite";
import {
    clearInvalidProp, covertToInt,
    createInputProp,
    createInputStore,
    createInputValueObject, ErrorResData, formatDate, postRequest, separateByComma,
} from "../../utils/AppUtils";
import DatePicker from "../../components/DatePicker";
import {NyukinPageStore} from "./NyukinPage";
import {storeContext} from "../../Context";

export const jsxBabelFix = jsx;

type NyukinListProp = {
    parentStore: NyukinPageStore;
};

const conditionBlock = css({
    padding: 10,
    display: "inline-block",
    verticalAlign: "top"
});

let today: any = moment().format("YYYY/MM");
let back = false;
let grid_id = '1';
const NyukinListPage: React.FC<NyukinListProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const gridRef = useRef({} as GridHandler);
    const parentStore: any = prop.parentStore!.store;
    const store = useLocalStore(() => ({
        nyukinYm: createInputStore<string>("入金年月", today),
        count: 0,
        show: false,

        async update() {
            if ($('.btnSelect').length > 0) {
                const updateRes = await postRequest<{ token: string }>(
                    "nyukinTorikomi/update",
                    {nyukinYm: store.nyukinYm!.value}
                );
                if (updateRes instanceof ErrorResData) {
                    await grobalStore!.showInvalidAlert(updateRes, this);
                    return;
                }
                await grobalStore!.showAlert("部署情報を更新しました。");

                store.show = false;
                clearInvalidProp(store);
                setTimeout(function () {
                    store.show = true;
                    gridRef!.current.reloadgrid(createInputValueObject(store));
                }, 1);
            } else {
                await grobalStore!.showAlert("指定のデータが見つかりません。");
            }
        },
    }));

    useEffect(() => {
        if (parentStore && !back) {
            back = true;
            store.nyukinYm.value = parentStore.nyukinYm.value;
            store.count = parentStore.count;
            store.show = true;
        }
    });

    return useObserver(() => (
        <div>
            <div css={conditionBlock} className={'form p-0 w-100 mb-0'}>
                <Row>
                    <Label width={135}> 入金年月</Label>
                    <DatePicker width={200} {...createInputProp(store.nyukinYm)}/>
                    <Button size={'lg'} className={'ml-5'}
                            onClick={() => {
                                if (!store.show) {
                                    store.show = true;
                                } else {
                                    store.show = false;
                                    clearInvalidProp(store);
                                    setTimeout(function () {
                                        store.show = true;
                                        gridRef!.current.reloadgrid(createInputValueObject(store));
                                    }, 1);
                                }
                            }}>検索</Button>
                </Row>
            </div>
            {store.show &&
            <div>
                <hr/>
                <div className={'w-1000'}>
                    <DataGrid
                        store={store}
                        ref={gridRef}
                        apiPath="nyukinTorikomi/list"
                        options={{
                            datatype: "json",
                            colModel: [
                                {
                                    label: "支店",
                                    name: "shitenName",
                                    width: 150,
                                    formatter: (val, opt, row) => {
                                        return `<button class="btnSelect btn btn-link" 
                                                data-code='${row.shitenCode}'
                                                data-kingaku='${row.nyukinKingaku}'
                                                data-name='${row.shitenName}'
                                                data-ym='${row.shiharaiYm}'
                                                data-so='${row.sosaigaku}'
                                                data-moto='${row.hatchumotoCode}'
                                                data-kikan='${row.kaikeiKikan}'
                                                data-nendo='${row.kaikeiNendo}'
                                                >${row.shitenName}</button>`;
                                    }
                                },
                                {
                                    label: "入金金額",
                                    name: "nyukinKingaku",
                                    width: 150,
                                    sorttype: "number",
                                    formatter: function (cellValue) {
                                        return cellValue ? separateByComma(cellValue) : '';
                                    }
                                },
                                {
                                    label: "相殺額",
                                    name: "sosaigaku",
                                    width: 150,
                                    sorttype: "number",
                                    formatter: function (cellValue) {
                                        return cellValue ? separateByComma(cellValue) : '';
                                    }
                                },
                                {
                                    label: "取込",
                                    name: "torikomi",
                                    width: 80,
                                },
                                {
                                    label: "入金年月",
                                    name: "shiharaiYm",
                                    width: 150,
                                    formatter: function (cellValue) {
                                        return cellValue ? formatDate(cellValue, 'yyyymm') : '';
                                    }
                                },
                                {name: "kaikeiKikan"},
                                {name: "kaikeiNendo"},
                            ],
                            loadComplete: function (data: any) {
                                let kingaku = 0, sosaigaku = 0;
                                data.rows.map((row:any) => {
                                    let x = row.nyukinKingaku ? covertToInt(row.nyukinKingaku) : 0;
                                    let y = row.sosaigaku ? covertToInt(row.sosaigaku) : 0;
                                    kingaku = kingaku + x;
                                    sosaigaku = sosaigaku + y;
                                    return row;
                                });
                                $('#jqGrid' + grid_id).jqGrid('footerData', 'set',
                                    {
                                        shitenName: '合計',
                                        nyukinKingaku: kingaku,
                                        sosaigaku: sosaigaku
                                    });
                            },
                            beforeProcessing: function (data: any) {
                                if( !data.records || data.records === 0 ){
                                    grobalStore!.showAlert("ＭＨ入金一括取込データが取得できませんでした。");
                                }
                            },
                            height: "auto",
                            maxHeight: 400,
                            footerrow: true,
                            userDataOnFooter : true,
                            postData: createInputValueObject(store)
                        }}
                        onInitialized={(id: string) => {
                            grid_id = id;
                            let grid = $('#jqGrid' + id);
                            grid.jqGrid('hideCol',['kaikeiKikan', 'kaikeiNendo']);

                            grid.on("click", ".btnSelect", e => {
                                let param = {
                                    shitenCode: $(e.currentTarget).data("code"),
                                    nyukinKingaku: $(e.currentTarget).data("kingaku"),
                                    shitenName: $(e.currentTarget).data("name"),
                                    shiharaiYm: $(e.currentTarget).data("ym"),
                                    sosaigaku: $(e.currentTarget).data("so"),
                                    hatchumotoCode: $(e.currentTarget).data("moto"),
                                    kaikeiKikan: $(e.currentTarget).data("kikan"),
                                    kaikeiNendo: $(e.currentTarget).data("nendo"),
                                    nyukinYm: store.nyukinYm!.value
                                };
                                prop.parentStore.idSelected(param, store);
                                back = false;
                            });
                        }}
                    />
                </div>
                <hr/>
                <div className={'text-right mb-4'}>
                    <Button id={'btn_update'} size={'lg'} onClick={store.update}>更新</Button>
                </div>
            </div>
            }
        </div>
    ));
};

export default NyukinListPage;
