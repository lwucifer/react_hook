import React, {useRef} from "react";
import {useLocalStore, useObserver} from "mobx-react-lite";
import {storeContext} from "../Context";
import {Modal} from "react-bootstrap";
import DataGrid, {GridHandler} from "../components/DataGrid";

import Row from "../components/Row";
import Button from "../components/Button";
import $ from "jquery";
import {createInputValueObject, resetStore} from "../utils/AppUtils";
/** @jsx jsx */
import {jsx, ClassNames} from "@emotion/core";

export const jsxBabelFix = jsx;

const OrderItemSearchDialog: React.FC = prop => {
    return (
        <div>
            <ClassNames>
                {({css}) => (
                    <OrderItemSearchDialogBase
                        dialogClassName={css({width: 800, maxWidth: "none"})}
                    />
                )}
            </ClassNames>
        </div>
    );
};

type OrderItemSearchDialogBaseProp = {
    dialogClassName: string;
};

const OrderItemSearchDialogBase: React.FC<OrderItemSearchDialogBaseProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = grobalStore!.orderItemSearchDialogProp;
    const gridRef = useRef({} as GridHandler);
    const localStore = useLocalStore(() => ({
        show: true,
    }));
    return useObserver(() => (
        <Modal
            show={store.show}
            dialogClassName={prop.dialogClassName}
            onHide={() => {
            }}
        >
            <Modal.Header>
                <Modal.Title>発注項目検索</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Row>
                        <Button
                            size="sm"
                            variant="dark"
                            onClick={() => {
                                resetStore(store)
                            }}
                        >
                            リセット
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                                store.show = false;
                                store.onClose && store.onClose(null);
                            }}
                        >
                            キャンセル
                        </Button>
                    </Row>
                    {localStore.show &&
                    <DataGrid
                        ref={gridRef}
                        apiPath="orderitem/list"
                        options={{
                            datatype: "json",
                            colModel: [
                                {
                                    label: "",
                                    name: "btnSelect",
                                    width: 65,
                                    fixed: true,
                                    align: "center",
                                    formatter: (val, opt, row) => {
                                        return `<button class="btnSelect" data-code='${
                                            row.orderItemCode
                                            }' data-name='${row.orderItemName}'>選択</button>`;
                                    }
                                },
                                {
                                    label: "発注項目",
                                    name: "orderItemCode",
                                    width: 75,
                                    fixed: true
                                },
                                {label: "発注項目名", name: "orderItemName", width: 90}
                            ],
                            postData: createInputValueObject(store)
                        }}
                        onInitialized={(id: string) => {
                            $('#jqGrid' + id).on("click", ".btnSelect", e => {
                                store.show = false;
                                store.onClose &&
                                store.onClose({
                                    orderItemCode: $(e.currentTarget).data("code"),
                                    orderItemName: $(e.currentTarget).data("name")
                                });
                            });
                        }}
                    />
                    }
                </div>
            </Modal.Body>
        </Modal>
    ));
};
export default OrderItemSearchDialog;
