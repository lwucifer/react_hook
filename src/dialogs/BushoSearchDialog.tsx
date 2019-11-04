import React, {useRef} from "react";
import {useObserver, Observer, useLocalStore} from "mobx-react-lite";
import {storeContext} from "../Context";
import {Modal} from "react-bootstrap";
import DataGrid, {GridHandler} from "../components/DataGrid";

import Label from "../components/Label";
import Row from "../components/Row";
import Button from "../components/Button";
import Text from "../components/Text";
import $ from "jquery";
import {createInputProp, createInputValueObject, resetStore} from "../utils/AppUtils";
/** @jsx jsx */
import {jsx, css, ClassNames} from "@emotion/core";

export const jsxBabelFix = jsx;

const BushoSearchDialog: React.FC = prop => {
    return (
        <div>
            <ClassNames>
                {({css, cx}) => (
                    <BushoSearchDialogBase
                        dialogClassName={css({width: 800, maxWidth: "none"})}
                    />
                )}
            </ClassNames>
        </div>
    );
};

type BushoSearchDialogBaseProp = {
    dialogClassName: string;
};

const BushoSearchDialogBase: React.FC<BushoSearchDialogBaseProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = grobalStore!.bushoSearchDialogProp;
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
                <Modal.Title>部署検索</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Row>
                        <Label width={100}>部署コード：</Label>
                        <Text width={100} imeOff {...createInputProp(store.bushoCode!)} />
                        <Label>部署名：</Label>
                        <Text width={100} {...createInputProp(store.bushoName!)} />
                        <Button
                            variant="primary"
                            onClick={() => {
                                localStore.show = false;
                                setTimeout(function () {
                                    localStore.show = true;
                                    gridRef!.current.reloadgrid(createInputValueObject(store));
                                }, 1);
                            }}
                        >
                            検索
                        </Button>
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
                        apiPath="busho/list"
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
                                        return `<button class="btnSelect" 
                    data-code='${row.bushoCode}' 
                    data-name='${row.bushoName}'
                    data-admin='${row.adminFlg}'
                    >選択</button>`;
                                    }
                                },
                                {
                                    label: "部署コード",
                                    name: "bushoCode",
                                    width: 75,
                                    fixed: true
                                },
                                {label: "部署名", name: "bushoName", width: 90}
                            ],
                            postData: createInputValueObject(store)
                        }}
                        onInitialized={(id: string) => {
                            $('#jqGrid' + id).on("click", ".btnSelect", e => {
                                store.show = false;
                                store.onClose &&
                                store.onClose({
                                    adminFlg: $(e.currentTarget).data("admin"),
                                    bushoCode: $(e.currentTarget).data("code"),
                                    bushoName: $(e.currentTarget).data("name")
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
export default BushoSearchDialog;
