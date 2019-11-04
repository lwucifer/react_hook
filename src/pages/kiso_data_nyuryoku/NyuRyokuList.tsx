import React, {useEffect, useRef} from "react";
import Button from "../../components/Button";
import Row from "../../components/Row";
import Label from "../../components/Label";
import Text from "../../components/Text";
import Radio from "../../components/Radio";
import {NyuRyokuPageStore} from "./NyuRyokuPage";

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
    formatDate,
    separateByComma, setStore2Store,
} from "../../utils/AppUtils";
import {storeContext} from "../../Context";
import DatePicker from "../../components/DatePicker";

export const jsxBabelFix = jsx;

type KisoListProp = {
    parentStore: NyuRyokuPageStore;
};

const conditionBlock = css({
    padding: 10,
    display: "inline-block",
    verticalAlign: "top"
});

let back = false;
let id = '';
const NyuRyokuList: React.FC<KisoListProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const gridRef = useRef({} as GridHandler);
    const parentStore: any = prop.parentStore!.store;
    const store = useLocalStore(() => ({
        kbn: createInputStore<string>("部署コード", parentStore ? parentStore.kbn!.value : '0'),
        constName: createInputStore<string>("邸名"),
        juchuTeamCode: createInputStore<string>("部署コード"),
        juchuTeamName: '',
        juchuTantoId: createInputStore<string>("部署"),
        juchuTantoName: '',
        uriageTeamCode: createInputStore<string>("部署コード"),
        uriageTeamName: '',
        uriageTantoId: createInputStore<string>("部署"),
        uriageTantoName: '',
        labelName: createInputStore<string>("部署コード"),
        hatchumotoCode: createInputStore<string>("発注元"),
        hatchumotoName: '',
        orderItemCode: createInputStore<string>("部署コード"),
        orderItemName: '',
        seikyuYmFrom: createInputStore<string>("請求年月"),
        seikyuYmTo: createInputStore<string>("請求年月"),
        uriageYoteiYmFrom: createInputStore<string>("売上予定年月"),
        uriageYoteiYmTo: createInputStore<string>("売上予定年月"),
        juchuYmFrom: createInputStore<string>("受注年月"),
        juchuYmTo: createInputStore<string>("受注年月"),
        uriageYmFrom: createInputStore<string>("売上年月"),
        uriageYmTo: createInputStore<string>("売上年月"),
        show: false,
        id: '',
    } ));

    useEffect(() => {
        if (parentStore && !back) {
            back = true;
            setStore2Store(store, parentStore);
            if (prop.parentStore!.updated) {
                id = parentStore.id
            } else {
                id = '';
            }
            store.show = true;
        }
    });

    return useObserver(() => (
        <div>
            <div className={'table'}>
                <div css={conditionBlock} className={'form p-0'}>
                    <Row>
                        <Label width={120}> 区分</Label>
                        <Radio name={'name'}
                               items={[
                                   {label: 'MH', value: '0', checked: store.kbn!.value == '0'},
                                   {label: '社外', value: '1', checked: store.kbn!.value == '1'},
                                   {label: '社内分配', value: '2', checked: store.kbn!.value == '2'}
                               ]}
                               onClick={async () => {
                                   store.labelName!.value = "";
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
                                    store.uriageTeamCode!.value = ret.teamCode;
                                    store.uriageTeamName = String(ret.teamName);
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
                        <Label width={120} className={store.kbn!.value === '0' ? 'disabled' : ''}>支店・事業所</Label>
                        <Text width={200} {...createInputProp(store.labelName!)} readOnly={true}/>
                        <Button
                            className={store.kbn!.value === '0' ? 'disabled fa fa-search' : 'fa fa-search'}
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
                    </Row>
                    <Row>
                        <Label width={120}>受注年月</Label>
                        <DatePicker width={200} {...createInputProp(store.juchuYmFrom!)}/>
                        <span className={'mr-2'}>～</span>
                        <DatePicker width={200} {...createInputProp(store.juchuYmTo!)}/>
                    </Row>
                    <Row>
                        <Label width={120}>売上年月</Label>
                        <DatePicker width={200} {...createInputProp(store.uriageYmFrom!)}/>
                        <span className={'mr-2'}>～</span>
                        <DatePicker width={200} {...createInputProp(store.uriageYmTo!)}/>
                    </Row>
                    <Row>
                        <Label width={120}>請求年月</Label>
                        <DatePicker width={200} {...createInputProp(store.seikyuYmFrom!)}/>
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
                                    store.uriageTantoId!.value = ret.userId;
                                    store.uriageTantoName = String(ret.userName);
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.juchuTantoId!.value = '';
                                    store.juchuTantoName = '';
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
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.uriageTantoId!.value = '';
                                    store.uriageTantoName = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={120}>邸名</Label>
                        <Text maxLength={40} width={200} {...createInputProp(store.constName!)}/>
                    </Row>
                    <Row>
                        <Label width={120}> 売上予定年月</Label>
                        <DatePicker width={200} {...createInputProp(store.uriageYoteiYmFrom!)} />
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
                                        id = '';
                                    }, 1);
                                }
                            }}>検索</Button>
                </div>
            </div>
            {store.show &&
            <DataGrid
                store={store}
                ref={gridRef}
                apiPath="kisoDataNyuryoku/list"
                options={{
                    datatype: "json",
                    colModel: [
                        {
                            label: "選択",
                            name: "id",
                            width: 50,
                            classes: 'text-center',
                            sortable: false,
                            formatter: function (cellValue, opt, row) {
                                return `<input type="checkbox" value="${cellValue}" id="check${cellValue}" class="btnSelect check-edit"
                                    data-id="${cellValue}"
                                    data-kbn="${row.kbn}" data-hatchumoto="${row.hatchumotoCode}" data-constno="${row.constNo}"  
                                    data-constdetailno="${row.constDetailNo}" data-orderno="${row.orderNo}" />`;
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
                            name: "labelName",
                            width: 150,
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
                            sorttype: 'number',
                            width: 50,
                        },
                        {
                            label: "受注金額（税込）",
                            name: "juchuKingakuZeiKomi",
                            width: 150,
                            sorttype: 'number',
                            formatter: function (cellValue) {
                                return cellValue ? separateByComma(cellValue) : '';
                            }
                        },
                        {
                            label: "請求日",
                            name: "seikyuYm",
                            width: 150,
                            formatter: function (cellValue) {
                                return cellValue ? formatDate(cellValue, 'yyyy/mm/dd') : '';
                            }
                        },
                    ],
                    loadComplete: function () {
                        if (id != '') {
                            $('#' + id + '.jqgrow').addClass('ui-state-hover ui-state-highlight');
                        }
                    },
                    postData: createInputValueObject(store)
                }}
                onInitialized={(id: string) => {
                    $(`#${id}`).on("click", ".btnSelect", e => {
                        let param = {
                            hatchumotoCode: $(e.currentTarget).data('hatchumoto'),
                            constNo: $(e.currentTarget).data('constno'),
                            constDetailNo: $(e.currentTarget).data('constdetailno'),
                            orderNo: $(e.currentTarget).data('orderno'),
                            kbn: $(e.currentTarget).data('kbn'),
                        };
                        store.id = $(e.currentTarget).data('id');
                        $('#' + store.id + '.jqgrow').addClass('ui-state-hover ui-state-highlight');
                        prop.parentStore.idSelected(parseInt(String($(e.currentTarget).val()), 10), param, store);
                        back = false;
                    });
                }}
            />
            }
        </div>
    ));
};

export default NyuRyokuList;
