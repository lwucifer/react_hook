import React, {useEffect, useRef} from "react";
import Button from "../../components/Button";
import Row from "../../components/Row";
import Label from "../../components/Label";
import Text from "../../components/Text";
import Checkbox from "../../components/Checkbox";
import Radio from "../../components/Radio";
import MainLayout from "../../layouts/MainLayout";
import dayjs from "dayjs";
import $ from "jquery";
import "free-jqgrid";
import "free-jqgrid/dist/i18n/grid.locale-ja";

/** @jsx jsx */
import {jsx, css} from "@emotion/core";
import DataGrid, {GridHandler} from "../../components/DataGrid";
import {useLocalStore, useObserver} from "mobx-react-lite";
import AppUtils, {
    createInputProp,
    createInputStore,
    createInputValueObject,
    ErrorResData,
    postRequest,
    formatDate,
    getUserId,
    arrayRemove, getUserName, separateByComma, ErrorInfo
} from "../../utils/AppUtils";
import {storeContext} from "../../Context";
import DatePicker from "../../components/DatePicker";
import {confirmAlert} from "react-confirm-alert";
import {Modal} from "react-bootstrap";

export const jsxBabelFix = jsx;

type TantoListProp = {};

const conditionBlock = css({
    padding: 10,
    display: "inline-block",
    verticalAlign: "top"
});

let ids: any = [];
let gridId: any = '1';
let userName: string = getUserName();
const TantoList: React.FC<TantoListProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const gridRef = useRef({} as GridHandler);
    const store= useLocalStore(() => ({
        orderItemCode: createInputStore<string>("発注項目コード"),
        orderItemName: createInputStore<string>("発注項目名称"),
        branchName: createInputStore<string>("支店・事業所"),
        labelName: createInputStore<string>("発注元"),
        branchName0: createInputStore<string>("支店・事業所"),
        labelName0: createInputStore<string>("発注元"),
        branchName1: createInputStore<string>("支店・事業所"),
        labelName1: createInputStore<string>("発注元"),
        juchuTanyoMinyuryokuChk : createInputStore<string>("状態", '1'),
        juchuYmFrom: createInputStore<string>("受注年月"),
        juchuYmTo: createInputStore<string>("受注年月"),
        constructionId: createInputStore<string>("工事番号"),
        constName: createInputStore<string>("邸名"),
        kbn: createInputStore<string>("区分", '0'),
        show: false,
    }));

    const storeInput = useLocalStore(() => ({
        id: createInputStore<number>("ID"),
        tousu: createInputStore<number>("棟数"),
        uriageYoteiYm: createInputStore<string>("売上予定年月"),
        planner: createInputStore<string>("プランナー"),
        biko: createInputStore<string>("備考"),

        async save() {
            let list: any = [];
            let i, l = ids.length;
            for (i = 0; i < l; i++) {
                let id = ids[i];
                let item = {
                    id: id,
                    tousu: parseInt(String($('#' + id + '_tousu').val()), 10),
                    uriageYoteiYm: String($('#' + id + '_uriageYoteiYm').val()).replace('/',''),
                    planner: $('#' + id + '_planner').val(),
                    biko: $('#' + id + '_biko').val(),
                    juchuTantoId: getUserId()
                };
                list.push(item);
            }
            list = {"juchuTantos": list};

            const updates = await postRequest<{}>(
                "juchuTanto/update",
                list
            );

            if (updates instanceof ErrorResData) {
                await grobalStore!.showInvalidAlert(updates, this);
                return;
            }

            await grobalStore!.showAlert("部署情報を更新しました。");

            let grid = $('#jqGrid' + gridId);
            $('#check-all').removeClass('active').prop('checked', false);
            $('.check-edit').removeClass('active').prop('checked', false);
            for (i = 0; i < l; i++) {
                grid.jqGrid('restoreRow', ids[i], function () {});
            }
            ids = [];

            store.show = false;
            setTimeout(function () {
                store.show = true;
                gridRef!.current.reloadgrid(createInputValueObject(store));
            }, 1);
        },
    }));

    useEffect(() => {
        userName = getUserName();
    });

    return useObserver(() => (
        <MainLayout
            systemName="業務システム"
            tilte="受注担当者入力"

        >
            <div className={'table'}>
                <div css={conditionBlock} className={'form p-0'}>
                    <Row>
                        <Label width={120}>状態</Label>
                        <Checkbox label={'担当者未入力のみ'} {...createInputProp(store.juchuTanyoMinyuryokuChk )} checked={true}/>
                    </Row>
                    <Row>
                        <Label width={120}> 区分</Label>
                        <Radio name={'kbn'}
                               items={[
                                   {label: 'MH', value: '0', checked: true},
                                   {label: '社外', value: '1', checked: false}
                               ]}
                               onClick={async () => {
                                   store.labelName!.value = "";
                                   store.labelName1!.value = "";
                                   store.branchName0!.value = "";
                                   store.branchName!.value = "";
                               }}
                               {...createInputProp(store.kbn)}
                        />
                    </Row>
                    <Row>
                        <Label width={120}> 受注年月</Label>
                        <DatePicker width={200} {...createInputProp(store.juchuYmFrom)}/>
                        <span className={'mr-2'}>～</span>
                        <DatePicker width={200} {...createInputProp(store.juchuYmTo)}/>
                    </Row>
                    <Row>
                        <Label width={120}>工事番号</Label>
                        <Text width={100} maxLength={8} imeOff {...createInputProp(store.constructionId)}/>
                    </Row>
                    <Row>
                        <Label width={120}> 発注項目</Label>
                        <Text width={200} {...createInputProp(store.orderItemName!)} readOnly={true}/>
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showOrderItemSearchDialog();
                                if (ret) {
                                    store.orderItemCode!.value = ret.orderItemCode;
                                    store.orderItemName!.value = ret.orderItemName;
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.orderItemCode!.value = '';
                                    store.orderItemName!.value = '';
                                }}
                        >取消</Button>
                    </Row>
                </div>
                <div css={conditionBlock} className={'form p-0'}>
                    <Row><span className={'h40'}/></Row>
                    <Row>
                        <Label width={120} className={store.kbn.value === '0' ? 'disabled' : ''}>発注元</Label>
                        <Text width={200} {...createInputProp(store.branchName0!)} readOnly={true}/>
                        <Button
                            className={store.kbn.value === '0' ? 'disabled fa fa-search' : 'fa fa-search'}
                            onClick={async () => {
                                const ret = await grobalStore!.showTorihikisakiSearchDialog({kbn:"OTHER"});
                                if (ret) {
                                    store.branchName0!.value = ret.torihikisakiAbbrName;
                                    store.branchName!.value = ret.torihikisakiAbbrName;
                                    store.labelName!.value = "";
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.branchName0!.value = '';
                                    store.branchName!.value = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={120} className={store.kbn.value === '1' ? 'disabled' : ''}>支店・事業所</Label>
                        <Text width={200} {...createInputProp(store.labelName1!)} readOnly={true}/>
                        <Button
                            className={store.kbn.value === '1' ? 'disabled fa fa-search' : 'fa fa-search'}
                            onClick={async () => {
                                const ret = await grobalStore!.showBranchSearchDialog();
                                if (ret) {
                                    store.labelName1!.value = ret.labelName;
                                    store.branchName!.value = "";
                                    store.labelName!.value = ret.labelName;
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.labelName1!.value = '';
                                    store.labelName!.value = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={120}>邸名</Label>
                        <Text width={200} maxLength={40} {...createInputProp(store.constName!)}/>
                    </Row>
                    <Row><span className={'h40'}/></Row>
                </div>

                <div css={conditionBlock} className={'form p-0 text-center'}>
                    <Button variant="primary" size={'lg'}
                            onClick={() => {
                                if (!store.show) {
                                    store.show = true;
                                } else {
                                    let i, l = ids.length;
                                    let grid = $('#jqGrid' + gridId);
                                    $('#check-all').removeClass('active').prop('checked', false);
                                    $('.check-edit').removeClass('active').prop('checked', false);
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
                <React.Fragment>
                <DataGrid
                    store={store}
                    ref={gridRef}
                    apiPath="juchuTanto/list"
                    options={{
                        datatype: "json",
                        colModel: [
                            {
                                label: "選択<br/><input type='checkbox' id='check-all'/>",
                                name: "id",
                                width: 50,
                                classes: 'text-center',
                                sortable: false,
                                formatter: function (cellValue) {
                                    return "<input type='checkbox' value='" + cellValue + "' id='check" + cellValue + "' class='check-edit'/>";
                                }
                            },
                            {
                                label: "受注担当者",
                                name: "juchuTantoName",
                                width: 150,
                                formatter: function (val, opt, row) {
                                    let vl = val == undefined ? '' : val;
                                    return "<span class='user' id='user"+ row.id +"' type='text' data-value='"+ vl +"'>"+ vl +"</span>" +
                                        "<span class='hidden user_edit' id='user_edit"+ row.id +"' type='text'>"+ userName +"</span>";
                                }
                            },
                            {
                                label: "工事番号",
                                name: "constNo",
                                width: 150,
                            },
                            {
                                label: "支店・事業所",
                                name: "shitenJigyoshoName",
                                width: 150,
                            },
                            {
                                label: "邸名",
                                name: "constName",
                                width: 250,
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
                                editoptions: {
                                    maxlength: 7,
                                    dataEvents: [{
                                        type: 'change', fn: function(e) {
                                            // let target = AppUtils.formatDate(String(e.target.value), 'yyyy/mm');
                                            // let dVal = dayjs(target);
                                            // let val = dVal.isValid() ? dVal.format("YYYY/MM") : "";
                                            // $('#'+ e.data.rowId +'_uriageYoteiYm').val(val);
                                        }},
                                    ]
                                },
                                editable: true,
                                formatter: function (cellValue) {
                                    return cellValue ? formatDate(cellValue.replace('/',''), 'yyyymm') : '';
                                }
                            },
                            {
                                label: "棟数",
                                name: "tousu",
                                width: 50,
                                editoptions: {maxlength: 2},
                                editable: true
                            },
                            {
                                label: "プランナー",
                                name: "planner",
                                width: 150,
                                editoptions: {maxlength: 10},
                                editable: true,
                                formatter: function (cellValue) {
                                    return cellValue ? cellValue : '';
                                }
                            },
                            {
                                label: "用途区分",
                                name: "yotoKbnName",
                                width: 150,
                            },
                            {
                                label: "発注番号",
                                name: "orderNo",
                                width: 80,
                            },
                            {
                                label: "受注金額（税込）",
                                name: "juchuKingakuZeiKomi",
                                width: 120,
                                sorttype: "number",
                                formatter: function (cellValue) {
                                    return separateByComma(cellValue);
                                }
                            },
                            {
                                label: "受注金額（税抜）",
                                name: "juchuKingakuZeiNuki",
                                width: 120,
                                sorttype: "number",
                                formatter: function (cellValue) {
                                    return separateByComma(cellValue);
                                }
                            },
                            {
                                label: "発注項目名称",
                                name: "orderItemName",
                                width: 150,
                            },
                            {
                                label: "備考",
                                name: "biko",
                                width: 250,
                                editoptions: {maxlength: 100},
                                editable: true,
                                formatter: function (cellValue) {
                                    return cellValue ? cellValue : '';
                                }
                            }
                        ],
                        postData: createInputValueObject(store)
                    }}
                    onInitialized={(id: string) => {
                        gridId = id;
                        let grid = $('#jqGrid' + id);
                        $(document).on('click', '#jqGrid' + id + '_id #check-all', function () {
                            const ids_all = grid.jqGrid('getDataIDs');
                            let i, l = ids_all.length;
                            if (!$(this).hasClass('active')) {
                                $('.user').addClass('hidden');
                                $('.user_edit').removeClass('hidden');
                                $(this).addClass('active');
                                $('.check-edit').addClass('active').prop('checked', true);
                                for (i = 0; i < l; i++) {
                                    !ids.includes(ids_all[i]) && ids.push(ids_all[i]);
                                    grid.jqGrid('editRow', ids_all[i], {keys: true});
                                }
                            } else {
                                $('.user_edit').addClass('hidden');
                                $('.user').removeClass('hidden');
                                $(this).removeClass('active');
                                $('.check-edit').removeClass('active').prop('checked', false);
                                for (i = 0; i < l; i++) {
                                    arrayRemove(ids, ids_all[i]);
                                    grid.jqGrid('restoreRow', ids_all[i], function () {});
                                }
                            }
                        });

                        function checkEdit(id: any, e: any) {
                            $('#user' +id).toggleClass('hidden');
                            $('#user_edit'+ id).toggleClass('hidden');
                            if ($(e).hasClass('active')) {
                                arrayRemove(ids, id);
                                $(e).removeClass('active');
                                grid.jqGrid('restoreRow', id, function () {});
                            } else {
                                ids.push(id);
                                $(e).addClass('active');
                                grid.jqGrid('editRow', id, {keys: true});
                            }
                        }

                        $(document).on('click', '#jqGrid' + id + ' .check-edit', function () {
                            let id: any = $(this).val();
                            let target = $('#user' +id);
                            if ( target.data('value') && !$(this).hasClass('active') && target.data('value') != userName ){
                                confirmAlert({
                                    customUI: ({ onClose }) => {
                                        return (
                                            <Modal show={true}>
                                                <Modal.Body>
                                                    <p>受注担当者が入っています。上書きしますか？</p>
                                                    <div className={'text-right'}>
                                                        <button className={'btn btn-primary'} onClick={() => {
                                                            checkEdit(id, this);
                                                            onClose();
                                                        }}>はい</button>
                                                        <button className={'btn'} onClick={() => {
                                                            $(this).removeClass('active').prop('checked', false);
                                                            onClose()
                                                        }}>いいえ</button>
                                                    </div>
                                                </Modal.Body>
                                            </Modal>
                                        );
                                    }
                                });
                            } else {
                                checkEdit(id, this);
                            }
                        });
                    }}
                />
                <Button size="lg" className={'float-right'} onClick={storeInput.save}>更新</Button>
                </React.Fragment>
            }
        </MainLayout>
    ));
};


export default TantoList;
