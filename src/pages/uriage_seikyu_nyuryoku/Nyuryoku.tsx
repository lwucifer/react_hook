import React, {useEffect, useRef} from "react";
import Button from "../../components/Button";
import Row from "../../components/Row";
import Label from "../../components/Label";
import Text from "../../components/Text";
import Checkbox from "../../components/Checkbox";
import Radio from "../../components/Radio";
import MainLayout from "../../layouts/MainLayout";
import moment from 'moment';

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
    postRequest,
    arrayRemove, formatDate, separateByComma, removeComma, covertToInt, download
} from "../../utils/AppUtils";
import {storeContext} from "../../Context";
import DatePicker from "../../components/DatePicker";

export const jsxBabelFix = jsx;

type NyuryokuProp = {};

const conditionBlock = css({
    padding: 10,
    display: "inline-block",
    verticalAlign: "top"
});

let ids: any = [];
let gridId: any = '1';
let today: any = moment().format("YYYY/MM/DD");

$(document).on("keydown", ".disabled input",e => {
    let code;
    if (e.keyCode) code = e.keyCode;
    else if (e.which) code = e.which;

    if (code != 9) return false;
});

const Nyuryoku: React.FC<NyuryokuProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const gridRef = useRef({} as GridHandler);
    const store = useLocalStore(() => ({
        constName: createInputStore<string>("部署コード"),
        orderItemCode: createInputStore<string>("部署コード"),
        orderItemName: '',
        kbn: createInputStore<string>("部署コード", '0'),
        juchuTeamCode: createInputStore<string>("部署コード"),
        juchuBumonCode: createInputStore<string>(""),
        juchuBushoCode: createInputStore<string>(""),
        uriageBumonCode: createInputStore<string>(""),
        uriageBushoCode: createInputStore<string>(""),
        juchuTeamName: '',
        juchuTantoId: createInputStore<string>("部署"),
        juchuTantoName: '',
        uriageTeamCode: createInputStore<string>("部署コード"),
        uriageTeamName: '',
        uriageTantoId: createInputStore<string>("部署"),
        uriageTantoName: '',
        hatchumotoCode: createInputStore<string>("発注元"),
        hatchumotoSecCode: createInputStore<string>("支店・事業所"),
        hatchumotoName: '',
        seikyuYmFrom: createInputStore<string>("請求年月"),
        seikyuYmTo: createInputStore<string>("請求年月"),
        uriageYoteiYmFrom: createInputStore<string>("売上予定年月"),
        uriageYoteiYmTo: createInputStore<string>("売上予定年月"),
        juchuYmFrom: createInputStore<string>("受注年月"),
        juchuYmTo: createInputStore<string>("受注年月"),
        uriageYmFrom: createInputStore<string>("売上年月"),
        uriageYmTo: createInputStore<string>("売上年月"),
        koshinzumiHihyoji: createInputStore<string>("", "1"),
        seikyuDate: today,
        show: false,
        ids: [],
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
            for (i = 0; i < l; i++) {
                let id = ids[i];
                let row: any = grid.jqGrid('getRowData', id);
                let item = {
                    konkaiSeikyuKingaku: removeComma(String($('#' + id + '_konkaiSeikyuKingaku').val())),
                    konkaiSeikyuPer: $('#' + id + '_konkaiSeikyuPer').val(),
                    seikyuDate: $('#' + id + '_seikyuDate').val(),
                    uriageDate: $('#' + id + '_uriageDate').val(),
                    kbn: row.kbn,
                    hatchumotoCode: row.hatchumotoCode,
                    constNo: row.constNo,
                    constDetailNo: row.constDetailNo,
                    orderNo: row.orderNo,
                    seikyuSeq: row.seikyuSeq,
                    juchuKingakuZeiKomi: removeComma(row.juchuKingakuZeiKomi),
                    kiSeikyuKingaku: removeComma(row.kiSeikyuKingaku),
                    koshinzumiHihyoji: store.koshinzumiHihyoji.value
                };
                list.push(item);
            }
            list = {"uriageSeikyuNyuryokus": list};
            const updates = await postRequest<{ token: string }>(
                "uriageSeikyuNyuryoku/update",
                list
            );
            if (updates instanceof ErrorResData) {
                await grobalStore!.showInvalidAlert(updates, this);
                return;
            }
            await grobalStore!.showAlert("部署情報を更新しました。");

            grid.find('#check-all').removeClass('active').prop('checked', false);
            grid.find('.check-edit').removeClass('active').prop('checked', false);
            grid.find('.today').val('').removeClass('today');
            for (i = 0; i < l; i++) {
                grid.jqGrid('restoreRow', ids[i], function () {});
            }
            ids = [];

            store.show = false;
            setTimeout(function () {
                store.show = true;
                gridRef!.current.reloadgrid(createInputValueObject(store));
            }, 1);

            download("uriageSeikyuNyuryoku/download", store, grobalStore);
        },
    }));

    useEffect(() => { store.ids = ids; });

    return useObserver(() => (
        <MainLayout systemName="業務システム" tilte="売上計上・請求入力">
            <div className={'table'}>
                <div css={conditionBlock} className={'form p-0'}>
                    <Row>
                        <Label width={120}> 区分</Label>
                        <Radio name={'name'}
                               items={[
                                   {label: 'MH', value: '0', checked: true},
                                   {label: '社外', value: '1', checked: false}
                               ]}
                               onClick={() => {
                                   store.hatchumotoName = '';
                                   store.hatchumotoCode.value = '';
                                   store.hatchumotoSecCode.value = '';
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
                        <Label width={120} className={store.kbn.value !== '0' ? 'disabled' : ''}>支店・事業所</Label>
                        <Text width={200} {...createInputProp(store.hatchumotoSecCode!)} readOnly={true}/>
                        <Button
                            className={store.kbn.value !== '0' ? 'disabled fa fa-search' : 'fa fa-search'}
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
                        <DatePicker width={200} {...createInputProp(store.juchuYmFrom)}/>
                        <span className={'mr-2'}>～</span>
                        <DatePicker width={200} {...createInputProp(store.juchuYmTo)}/>
                    </Row>
                    <Row>
                        <Label width={120}>売上年月</Label>
                        <DatePicker width={200} {...createInputProp(store.uriageYmFrom)} />
                        <span className={'mr-2'}>～</span>
                        <DatePicker width={200} {...createInputProp(store.uriageYmTo)} />
                    </Row>
                    <Row>
                        <Label width={120}>請求年月</Label>
                        <DatePicker width={200} {...createInputProp(store.seikyuYmFrom)}/>
                        <span className={'mr-2'}>～</span>
                        <DatePicker width={200} {...createInputProp(store.seikyuYmTo)}/>
                    </Row>
                </div>
                <div css={conditionBlock} className={'form p-0'}>
                    <Row>
                        <Label width={120} className={store.kbn.value === '0' ? 'disabled' : ''}>発注元</Label>
                        <Text width={200} value={store.hatchumotoName} readOnly={true}/>
                        <Button
                            className={store.kbn.value === '0' ? 'disabled fa fa-search' : 'fa fa-search'}
                            onClick={async () => {
                                const ret = await grobalStore!.showTorihikisakiSearchDialog({kbn:"OTHER"});
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
                        <DatePicker width={200} {...createInputProp(store.uriageYoteiYmFrom)} />
                        <span className={'mr-2'}>～</span>
                        <DatePicker width={200} {...createInputProp(store.uriageYoteiYmTo)}/>
                    </Row>
                    <Row>
                        <Label width={120}>発注項目</Label>
                        <Text width={200} value={store.orderItemName!} readOnly={true}/>
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
                    <Row>
                        <Label width={120}> その他</Label>
                        <Checkbox label={'更新済みを表示しない'} {...createInputProp(store.koshinzumiHihyoji!)} checked={true}/>
                    </Row>
                </div>
                <div css={conditionBlock} className={'form p-0 text-center'}>
                    <Button size={'lg'}
                            onClick={() => {
                                if (!store.show) {
                                    store.show = true;
                                } else {
                                    let i, l = ids.length;
                                    let grid = $('#jqGrid' + gridId);
                                    grid.find('#check-all').removeClass('active').prop('checked', false);
                                    grid.find('.check-edit').removeClass('active').prop('checked', false);
                                    for (i = 0; i < l; i++) {
                                        grid.jqGrid('restoreRow', ids[i], function () {});
                                    }
                                    ids = [];

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
            <div>
                <DataGrid
                    store={store}
                    ref={gridRef}
                    apiPath="uriageSeikyuNyuryoku/list"
                    options={{
                        datatype: "json",
                        sortname: "kiSeikyuPer",
                        colModel: [
                            {
                                label: "請求<br/><input type='checkbox' class='check-all'/>",
                                name: "id",
                                width: 60,
                                classes: 'text-center',
                                sortable: false,
                                formatter: function (cellValue) {
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
                                width: 165,
                            },
                            {
                                label: "受注担当者",
                                name: "juchuTantoName",
                                width: 120,
                            },
                            {
                                label: "売上担当者",
                                name: "uriageTantoName",
                                width: 120,
                            },
                            {
                                label: "受注年月",
                                name: "juchuYm",
                                width: 100,
                                formatter: function (cellValue) {
                                    return cellValue ? formatDate(cellValue, 'yyyy/mm') : '';
                                }
                            },
                            {
                                label: "売上予定年月",
                                name: "uriageYoteiYm",
                                width: 100,
                                formatter: function (cellValue) {
                                    return cellValue ? formatDate(cellValue, 'yyyy/mm') : '';
                                }
                            },
                            {
                                label: "発注項目名称",
                                name: "orderItemName",
                                width: 120,
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
                                editable: true,
                                sorttype: "number",
                                formatter: function (cellValue) {
                                    return cellValue ? separateByComma(cellValue) : '';
                                },
                                editoptions: {
                                    dataEvents: [{
                                        type: 'keyup',
                                        fn: function(e) {
                                            let rowId = e.data.rowId;
                                            let target = $('#jqGrid' + gridId);
                                            let row: any = target.jqGrid('getRowData', rowId);
                                            let kon = covertToInt(removeComma(row.juchuKingakuZeiKomi)) - covertToInt(removeComma(row.kiSeikyuKingaku));
                                            let val:any = kon !== 0 ? covertToInt(removeComma(e.target.value)) / kon * 100 : 0;
                                            val = val ? removeComma(String(covertToInt(val))) : '';
                                            target.find('#'+ rowId + '_konkaiSeikyuPer').val(val);
                                            target.find('#'+ rowId + '_konkaiSeikyuKingaku').val(separateByComma(covertToInt(removeComma(e.target.value))));
                                            if (val == '100'){
                                                target.find('#'+ rowId + '_uriageDate').val(today).addClass('today');
                                            } else {
                                                target.find('#'+ rowId + '_uriageDate').val('').removeClass('today');
                                            }
                                        }},
                                    ]
                                }
                            },
                            {
                                label: "今回請求%<br/>（累計）",
                                name: "konkaiSeikyuPer",
                                width: 90,
                                editable: true,
                                sorttype: "number",
                                classes: "per",
                                formatter: function (cellValue, opt, row) {
                                    setTimeout(function () {
                                        if (cellValue && cellValue !== '0') {
                                            $("#" + opt.rowId).addClass('per');
                                        }
                                    }, 100);
                                    return cellValue ? cellValue : '';
                                },
                                editoptions: {
                                    maxlength: 3,
                                    dataEvents: [{
                                        type: 'keyup', fn: function(e) {
                                            let rowId = e.data.rowId;
                                            let target = $('#jqGrid' + gridId);
                                            let row: any = target.jqGrid('getRowData', rowId);

                                            let kon = covertToInt(removeComma(row.juchuKingakuZeiKomi)) - covertToInt(removeComma(row.kiSeikyuKingaku));
                                            let val = kon !== 0 ? covertToInt(e.target.value) * kon / 100 : 0;
                                            target.find('#' + rowId + '_konkaiSeikyuKingaku').val(separateByComma(covertToInt(val)));
                                            if (e.target.value == '100') {
                                                target.find('#' + rowId + '_uriageDate').val(today).addClass('today');
                                            } else {
                                                target.find('#' + rowId + '_uriageDate').val('').removeClass('today');
                                            }
                                        }},
                                    ]
                                }
                            },
                            {
                                label: "売上日",
                                name: "uriageDate",
                                width: 100,
                                editable: true,
                                classes: 'disabled',
                                formatter: function (cell) {
                                    return cell ? cell : '';
                                }
                            },
                            {
                                label: "請求日",
                                name: "seikyuDate",
                                width: 100,
                                editable: true,
                                classes: 'disabled',
                                formatter: function (cell) {
                                    return cell ? cell : '';
                                }
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
                                width: 90,
                                sorttype: "number",
                                formatter: function (cellValue) {
                                    return cellValue ? cellValue + '%' : '';
                                }
                            },
                            { name: "hatchumotoCode"},
                            { name: "kbn"},
                            { name: "constDetailNo"},
                            { name: "seikyuSeq"},
                            { name: "uriageFlg"},
                            { name: "kakuninDate"},
                        ],
                        loadComplete: function() {},
                        postData: createInputValueObject(store)
                    }}
                    onInitialized={(gid: string) => {
                        gridId = gid;
                        let grid = $('#jqGrid' + gid);
                        grid.jqGrid('hideCol',['hatchumotoCode', 'kbn', 'constDetailNo', 'seikyuSeq', 'uriageFlg','kakuninDate']);

                        $(document).on('click', '#jqGrid' + gid + '_id .check-all', function () {
                            const ids_all = grid.jqGrid('getDataIDs');
                            let i, l = ids_all.length;
                            if (!$(this).hasClass('active')) {
                                $(this).addClass('active');
                                grid.find('.check-edit').addClass('active').prop('checked', true);
                                for (i = 0; i < l; i++) {
                                    let row: any = grid.jqGrid('getRowData', ids_all[i]);
                                    if (check(row)) {
                                        !ids.includes(ids_all[i]) && ids.push(ids_all[i]);
                                        grid.jqGrid('editRow', ids_all[i], {keys: true});
                                        setValuesEditMode(ids_all[i]);
                                        if (checkDefault(row)) {
                                            $('#' + ids_all[i] + '_konkaiSeikyuPer').prop('disabled', 'disabled');
                                        }
                                        if (checkDefault2(row)) {
                                            $('#' + ids_all[i] + '_konkaiSeikyuKingaku').prop('disabled', 'disabled');
                                        }
                                    }
                                }
                            } else {
                                $(this).removeClass('active');
                                grid.find('.check-edit').removeClass('active').prop('checked', false);
                                for (i = 0; i < l; i++) {
                                    let row: any = grid.jqGrid('getRowData', ids_all[i]);
                                    if (check(row)) {
                                        arrayRemove(ids, ids_all[i]);
                                        grid.jqGrid('restoreRow', ids_all[i], function () {});
                                    }
                                }
                            }
                        });

                        $(document).on('click', '#jqGrid' + gid + ' .check-edit', function () {
                            let id: any = $(this).val();
                            let row: any = grid.jqGrid('getRowData', id);
                            if (!$(this).hasClass('active')) {
                                $(this).addClass('active');
                                if (check(row)) {
                                    ids.push(id);
                                    grid.jqGrid('editRow', id, {keys: true});
                                    setValuesEditMode(id);
                                    if (checkDefault(row)) {
                                        $('#' + id + '_konkaiSeikyuPer').prop('disabled', 'disabled');
                                    }
                                    if (checkDefault2(row)) {
                                        $('#' + id + '_konkaiSeikyuKingaku').prop('disabled', 'disabled');
                                    }
                                }
                            } else {
                                $(this).removeClass('active');
                                if (check(row)) {
                                    arrayRemove(ids, id);
                                    grid.jqGrid('restoreRow', id, function () {});
                                }
                            }
                        });

                        function check(row: any) {
                            if (row.uriageFlg === 'true' &&
                                (row.seikyuSeq === '1' || row.seikyuSeq === '1') &&
                                store.koshinzumiHihyoji.value === '0' &&
                                row.kakuninDate !== '1900-01-01'
                            ) {
                                return false;
                            }
                            return true;
                        }

                        function checkDefault2(row: any) {
                            if (store.koshinzumiHihyoji.value === '1' &&
                                row.uriageFlg === 'true' && row.seikyuSeq === '2') {
                                return true;
                            }
                            return false;
                        }

                        function checkDefault(row: any) {
                            if (store.koshinzumiHihyoji.value === '1' &&
                                row.uriageFlg === 'true' && row.seikyuSeq === '2') {
                                return true;
                            }

                            if (row.uriageFlg === 'true' &&
                                (row.seikyuSeq === '1' || row.seikyuSeq === '2') &&
                                store.koshinzumiHihyoji.value === '0' &&
                                row.kakuninDate === '1900-01-01'
                            ) {
                                return true;
                            }
                            return  false;
                        }

                        function setValuesEditMode(id: any) {
                            let row: any = grid.jqGrid('getRowData', id);
                            let komi = row.juchuKingakuZeiKomi ? covertToInt(removeComma(row.juchuKingakuZeiKomi)) : 0;
                            let kisei = row.kiSeikyuKingaku ? covertToInt(removeComma(row.kiSeikyuKingaku)) : 0;
                            let konkon = komi - kisei;

                            let per = 100;
                            if (row.orderItemName == "実施設計" || row.orderItemName == "追加設計料") {
                                per = 50;
                                if (row.orderItemName == "実施設計" && row.tousu == '0') per = 100;
                            }
                            if (row.kiSeikyuKingaku && row.kiSeikyuKingaku != 0) per = 100;
                            if (konkon === 0) per = 0;
                            if (!row.konkaiSeikyuPer) grid.find('#'+ id + '_konkaiSeikyuPer').val(per);

                            let konkai = per === 50 ? konkon / 2 : konkon;
                            if (row.konkaiSeikyuKingaku === '') {
                                grid.find('#'+ id + '_konkaiSeikyuKingaku').val(separateByComma(covertToInt(removeComma(String(konkai)))));
                            }

                            if ((row.konkaiSeikyuPer == 100 || row.konkaiSeikyuPer == '') && per == 100) {
                                grid.find('#'+ id + '_uriageDate').val(today).addClass('today');
                            }
                            grid.find('#'+ id + '_seikyuDate').val(today).addClass('today');
                        }
                    }}
                />
                <div className={'d-flex align-items-center'}>
                    <div className={'form mb-0'}>
                        <Row>
                            <Label width={120}>請求日</Label>
                            <DatePicker type={'date'} width={200} value={store.seikyuDate}
                                        onChange={(e) => {
                                            store.seikyuDate = today = e;
                                            $('.today').val(today);
                                        }}
                            />
                        </Row>
                    </div>
                    <div className={'ml-auto'}>
                        <Button size={'lg'}
                            onClick={() => {
                                download("uriageSeikyuNyuryoku/download", store, grobalStore);
                            }}
                        >ダウンロード</Button>
                        <Button size={'lg'} onClick={storeInput.save}>更新</Button>
                    </div>
                </div>
            </div>
            }
        </MainLayout>
    ));
};

export default Nyuryoku;
