import React, {useEffect, useRef} from "react";
import Button from "../../components/Button";
import Row from "../../components/Row";
import Label from "../../components/Label";
import Text from "../../components/Text";
import Radio from "../../components/Radio";

import MainLayout from "../../layouts/MainLayout";

import $ from "jquery";
import "free-jqgrid";
import "free-jqgrid/dist/i18n/grid.locale-ja";

/** @jsx jsx */
import {jsx, css} from "@emotion/core";
import DataGrid, {GridHandler} from "../../components/DataGrid";
import {useLocalStore, useObserver} from "mobx-react-lite";
import {
    createInputProp,
    createInputStore,
    createInputValueObject,
    ErrorResData,
    postRequest, arrayRemove, formatDate, separateByComma, download, covertToInt,
} from "../../utils/AppUtils";
import {storeContext} from "../../Context";
import DatePicker from "../../components/DatePicker";

export const jsxBabelFix = jsx;

type KakukinProp = {};

const conditionBlock = css({
    padding: 10,
    display: "inline-block",
    verticalAlign: "top"
});

let gridId: any = '1';
let ids: any = [];
const Kakunin: React.FC<KakukinProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const gridRef = useRef({} as GridHandler);
    const store = useLocalStore(() => ({
        kbn: createInputStore<string>("部署コード", '0'),
        constName: createInputStore<string>("邸名"),
        juchuTeamCode: createInputStore<string>("部署コード"),
        juchuTeamName: '',
        juchuTantoId: createInputStore<string>("部署"),
        juchuTantoName: '',
        uriageTeamCode: createInputStore<string>("部署コード"),
        uriageTeamName: '',
        uriageTantoId: createInputStore<string>("部署"),
        uriageTantoName: '',
        hatchumotoSecCode: createInputStore<string>("支店・事務所コード"),
        hatchumotoCode: createInputStore<string>("発注元"),
        hatchumotoName: '',
        orderItemCode: createInputStore<string>("部署コード"),
        orderItemName: '',
        juchuBushoCode: createInputStore<string>(""),
        juchuBumonCode: createInputStore<string>(""),
        uriageBushoCode: createInputStore<string>(""),
        uriageBumonCode: createInputStore<string>(""),
        isOrderLink : createInputStore<boolean>("", true),
        show: false,
        ids: [],
        seikyuYmFrom: createInputStore<string>("請求年月"),
        seikyuYmTo: createInputStore<string>("請求年月"),
        uriageYoteiYmFrom: createInputStore<string>("売上予定年月"),
        uriageYoteiYmTo: createInputStore<string>("売上予定年月"),
        juchuYmFrom: createInputStore<string>("受注年月"),
        juchuYmTo: createInputStore<string>("受注年月"),
        uriageYmFrom: createInputStore<string>("売上年月"),
        uriageYmTo: createInputStore<string>("売上年月"),
    }));

    const storeInput = useLocalStore(() => ({
        konkaiSeikyuKingaku: createInputStore<string>("今回請求金額"),
        konkaiSeikyuPer: createInputStore<string>("今回請求%（累計）"),
        seikyuDate: createInputStore<string>("請求日"),
        uriageDate: createInputStore<string>("売上日"),
        kbn: createInputStore<string>("区分"),
        hatchumotoCode: createInputStore<string>("発注元"),
        constNo: createInputStore<string>("工事番号"),
        constDetailNo: createInputStore<string>("工事番号"),
        orderNo: createInputStore<string>("発注番号"),
        seikyuSeq: createInputStore<string>("請求SEQ"),
        juchuKingakuZeiKomi: createInputStore<string>("受注金額"),
        kiSeikyuKingaku: createInputStore<string>("既請求額"),
        koshinzumiHihyoji: createInputStore<string>(""),

        async save() {
            let grid = $('#jqGrid' + gridId);
            let list: any = [];
            let i, l = ids.length;
            if (l > 0) {
                for (i = 0; i < l; i++) {
                    let id = ids[i];
                    let row: any = grid.jqGrid('getRowData', id);
                    let item = {
                        kbn: row.kbn,
                        hatchumotoCode: row.hatchumotoCode,
                        constNo: row.constNo,
                        constDetailNo: row.constDetailNo,
                        orderNo: row.orderNo,
                        seikyuSeq: row.seikyuSeq,
                    };
                    list.push(item);
                }
                list = {"uriageSeikyuKakuninUpdate": list};
                const updates = await postRequest<{ token: string }>(
                    "uriageSeikyuKakunin/update",
                    list
                );
                if (updates instanceof ErrorResData) {
                    await grobalStore!.showInvalidAlert(updates, this);
                    return;
                }
                await grobalStore!.showAlert("部署情報を更新しました。");

                $('#check-all').removeClass('active').prop('checked', false);
                $('.check-edit').removeClass('active').prop('checked', false);
                $('.today').val('').removeClass('today');
                for (i = 0; i < l; i++) {
                    grid.jqGrid('restoreRow', ids[i], function () {
                    });
                }

                store.show = false;
                setTimeout(function () {
                    store.show = true;
                    gridRef!.current.reloadgrid(createInputValueObject(store));
                }, 1);
                ids = [];

                store.isOrderLink.value = true;
                download("uriageSeikyuKakunin/download", store, grobalStore);
            } else {
                await grobalStore!.showAlert("指定のデータが見つかりません。");
            }
        },
    }));

    useEffect(() => {
        store.ids = ids;
    });

    return useObserver(() => (
        <MainLayout
            systemName="業務システム"
            tilte="売上計上・請求確認"
        >
            <div className={'table'}>
                <div css={conditionBlock} className={'form p-0'}>
                    <Row>
                        <Label width={120}> 区分</Label>
                        <Radio name={'name'}
                               items={[
                                   {label: 'MH', value: '0', checked: true},
                                   {label: '社外', value: '1', checked: false}
                               ]}
                               onClick={async () => {
                                   store.hatchumotoSecCode!.value = "";
                                   store.hatchumotoCode!.value = "";
                                   store.hatchumotoName = "";
                               }}
                               {...createInputProp(store.kbn!)}
                        />
                    </Row>
                    <Row>
                        <Label width={120}>受注チーム</Label>
                        <Text width={200} value={store.juchuTeamName} readOnly={true}/>
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showTeamSearchDialog();
                                if (ret) {
                                    store.juchuTeamCode!.value = ret.teamCode;
                                    store.juchuTeamName = String(ret.teamName);
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.juchuTeamCode!.value = '';
                                    store.juchuTeamName = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={120}>売上チーム</Label>
                        <Text width={200} value={store.uriageTeamName} readOnly={true}/>
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showTeamSearchDialog();
                                if (ret) {
                                    store.uriageTeamCode!.value = ret.teamCode;
                                    store.uriageTeamName = String(ret.teamName);
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.uriageTeamCode!.value = '';
                                    store.uriageTeamName = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={120} className={store.kbn!.value !== '0' ? 'disabled' : ''}>支店・事業所</Label>
                        <Text width={200} {...createInputProp(store.hatchumotoSecCode!)} readOnly={true}/>
                        <Button
                            className={store.kbn!.value !== '0' ? 'disabled fa fa-search' : 'fa fa-search'}
                            onClick={async () => {
                                const ret = await grobalStore!.showBranchSearchDialog();
                                if (ret) {
                                    store.hatchumotoSecCode!.value = ret.labelName;
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.hatchumotoSecCode!.value = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={120}>受注年月</Label>
                        <DatePicker width={200} {...createInputProp(store.juchuYmFrom!)} />
                        <span className={'mr-2'}>～</span>
                        <DatePicker width={200} {...createInputProp(store.juchuYmTo!)}/>
                    </Row>
                    <Row>
                        <Label width={120}>売上年月</Label>
                        <DatePicker width={200} {...createInputProp(store.uriageYmFrom!)} />
                        <span className={'mr-2'}>～</span>
                        <DatePicker width={200} {...createInputProp(store.uriageYmTo!)}/>
                    </Row>
                    <Row>
                        <Label width={120}>請求年月</Label>
                        <DatePicker width={200} {...createInputProp(store.seikyuYmFrom!)} />
                        <span className={'mr-2'}>～</span>
                        <DatePicker width={200} {...createInputProp(store.seikyuYmTo!)}/>
                    </Row>
                </div>
                <div css={conditionBlock} className={'form p-0'}>
                    <Row>
                        <Label width={120} className={store.kbn!.value !== '1' ? 'disabled' : ''}>発注元</Label>
                        <Text width={200} value={store.hatchumotoName} readOnly={true}/>
                        <Button
                            className={store.kbn!.value !== '1' ? 'disabled fa fa-search' : 'fa fa-search'}
                            onClick={async () => {
                                const ret = await grobalStore!.showTorihikisakiSearchDialog({kbn: "OTHER"});
                                if (ret) {
                                    store.hatchumotoCode!.value = ret.torihikisakiCode;
                                    store.hatchumotoName = String(ret.torihikisakiAbbrName);
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.hatchumotoCode!.value = '';
                                    store.hatchumotoName = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={120}> 受注担当者</Label>
                        <Text width={200} value={store.juchuTantoName} readOnly={true}/>
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showUserSearchDialog();
                                if (ret) {
                                    store.juchuTantoId!.value = ret.userId;
                                    store.juchuTantoName = String(ret.userName);
                                    store.juchuBumonCode!.value = ret.bumonCode;
                                    store.juchuBushoCode!.value = ret.bushoCode;
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.juchuTantoId!.value = '';
                                    store.juchuTantoName = '';
                                    store.juchuBumonCode!.value = '';
                                    store.juchuBushoCode!.value = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={120}> 売上担当者</Label>
                        <Text width={200} value={store.uriageTantoName} readOnly={true}/>
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showUserSearchDialog();
                                if (ret) {
                                    store.uriageTantoId!.value = ret.userId;
                                    store.uriageTantoName = String(ret.userName);
                                    store.uriageBumonCode!.value = ret.bumonCode;
                                    store.uriageBushoCode!.value = ret.bushoCode;
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.uriageTantoId!.value = '';
                                    store.uriageTantoName = '';
                                    store.uriageBumonCode!.value = '';
                                    store.uriageBushoCode!.value = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={120}>邸名</Label>
                        <Text maxLength={40} width={200} {...createInputProp(store.constName!)}/>
                    </Row>
                    <Row>
                        <Label width={120}> 売上予定年月</Label>
                        <DatePicker width={200} {...createInputProp(store.uriageYoteiYmFrom!)}/>
                        <span className={'mr-2'}>～</span>
                        <DatePicker width={200} {...createInputProp(store.uriageYoteiYmTo!)}/>
                    </Row>
                    <Row>
                        <Label width={120}>発注項目</Label>
                        <Text width={200} value={store.orderItemName} readOnly={true}/>
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showOrderItemSearchDialog();
                                if (ret) {
                                    store.orderItemName = String(ret.orderItemName);
                                    store.orderItemCode!.value = ret.orderItemCode;
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.orderItemName = '';
                                    store.orderItemCode!.value = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row><span className={'h40'}/></Row>
                </div>
                <div css={conditionBlock} className={'form p-0 text-center'}>
                    <Button size={'lg'}
                            onClick={() => {
                                if (!store.show) {
                                    store.show = true;
                                } else {
                                    store.show = false;
                                    setTimeout(function () {
                                        store.show = true;
                                        gridRef!.current.reloadgrid(createInputValueObject(store));
                                    }, 1);
                                }
                            }}>検索</Button>
                </div>
            </div>
            {store.show &&
            <React.Fragment>
                <DataGrid
                    store={store}
                    ref={gridRef}
                    apiPath="uriageSeikyuKakunin/list"
                    options={{
                        datatype: "json",
                        colModel: [
                            {
                                label: "確認",
                                name: "kakunin",
                                width: 40,
                            },
                            {
                                label: "選択<br/><input type='checkbox' id='check-all'/>",
                                name: "id",
                                width: 50,
                                classes: 'text-center',
                                sortable: false,
                                formatter: function (cellValue, opt, row) {
                                    if (row.kakunin !== '') {
                                        return "<input type='checkbox' disabled='disabled'/>";
                                    }
                                    return "<input type='checkbox' value='" + cellValue + "' id='check" + cellValue + "' class='check-edit'/>";
                                }
                            },
                            {
                                label: "受注チーム",
                                name: "juchuTeamName",
                                width: 100,
                            },
                            {
                                label: "売上チーム",
                                name: "uriageTeamName",
                                width: 100,
                            },
                            {
                                label: "邸名",
                                name: "constName",
                                width: 250,
                            },
                            {
                                label: "支店・事業所",
                                name: "shitenJigyosho",
                                width: 160,
                            },
                            {
                                label: "受注担当者",
                                name: "juchuTantoName",
                                width: 100,
                            },
                            {
                                label: "売上担当者",
                                name: "uriageTantoName",
                                width: 100,
                            },
                            {
                                label: "受注年月",
                                name: "juchuYm",
                                width: 100,
                                formatter: function (cellValue) {
                                    return cellValue ? formatDate(cellValue, 'yyyymm') : '';
                                }
                            },
                            {
                                label: "売上予定年月",
                                name: "uriageYoteiYm",
                                width: 100,
                                formatter: function (cellValue) {
                                    return cellValue ? formatDate(cellValue, 'yyyymm') : '';
                                }
                            },
                            {
                                label: "発注項目名称",
                                name: "orderItemName",
                                width: 100,
                            },
                            {
                                label: "発注番号",
                                name: "orderNo",
                                width: 100,
                            },
                            {
                                label: "工事番号",
                                name: "constNo",
                                width: 100,
                            },
                            {
                                label: "棟数",
                                name: "tousu",
                                width: 50,
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
                                label: "今回請求金額",
                                name: "konkaiSeikyuKingaku",
                                width: 100,
                                sorttype: "number",
                                formatter: function (cellValue) {
                                    return cellValue ? separateByComma(cellValue) : '';
                                }
                            },
                            {
                                label: "今回請求%<br/>（累計）",
                                name: "konkaiSeikyuPer",
                                width: 80,
                                sorttype: "number",
                                formatter: function (cellValue) {
                                    return cellValue ? cellValue + '%' : '';
                                }
                            },
                            {
                                label: "売上日",
                                name: "uriageDate",
                                width: 100,
                            },
                            {
                                label: "請求日",
                                name: "seikyuDate",
                                width: 100,
                            },
                            {
                                label: "既請求額",
                                name: "kiSeikyuKingaku",
                                width: 100,
                                sorttype: "number",
                                formatter: function (cellValue) {
                                    return cellValue ? separateByComma(cellValue) : '';
                                }
                            },
                            {
                                label: "既請求%",
                                name: "kiSeikyuPer",
                                width: 80,
                                sorttype: "number",
                                formatter: function (cellValue) {
                                    return cellValue ? cellValue + '%' : '';
                                }
                            },
                            {name: "constDetailNo"},
                            {name: "seikyuSeq"},
                            {name: "hatchumotoCode"},
                            {name: "kbn"},
                        ],
                        postData: createInputValueObject(store)
                    }}
                    onInitialized={(id: string) => {
                        gridId = id;
                        let grid = $('#jqGrid' + id);
                        grid.jqGrid('hideCol',['constDetailNo', 'seikyuSeq', 'hatchumotoCode', 'kbn']);

                        $(document).on('click', '#jqGrid' + id + '_id #check-all', function () {
                            const ids_all = grid.jqGrid('getDataIDs');
                            let i, l = ids_all.length;
                            if (!$(this).hasClass('active')) {
                                $(this).addClass('active');
                                $('.check-edit').addClass('active').prop('checked', true);
                                for (i = 0; i < l; i++) {
                                    !ids.includes(ids_all[i]) && ids.push(ids_all[i]);
                                    grid.jqGrid('editRow', ids_all[i], {keys: true});
                                }
                            } else {
                                $(this).removeClass('active');
                                $('.check-edit').removeClass('active').prop('checked', false);
                                for (i = 0; i < l; i++) {
                                    arrayRemove(ids, ids_all[i]);
                                    grid.jqGrid('restoreRow', ids_all[i], function () {});
                                }
                            }
                        });

                        $(document).on('click', '#jqGrid' + id + ' .check-edit', function () {
                            let id: any = $(this).val();
                            if (!$(this).hasClass('active')) {
                                ids.push(id);
                                $(this).addClass('active');
                                grid.jqGrid('editRow', id, {keys: true});
                            } else {
                                arrayRemove(ids, id);
                                $(this).removeClass('active');
                                grid.jqGrid('restoreRow', id, function () {});
                            }
                        });
                    }}
                />
                <div className={'float-right'}>
                    <Button size={'lg'}
                        onClick={() => {
                            store.isOrderLink.value = false;
                            download("uriageSeikyuKakunin/download", store, grobalStore);
                        }}
                    >ダウンロード</Button>
                    <Button size={'lg'} onClick={storeInput.save}>請求データ電子受発注連携</Button>
                </div>
            </React.Fragment>
            }
        </MainLayout>
    ));
};

export default Kakunin;
