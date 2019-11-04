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

const BumonSearchDialog: React.FC = prop => {
    return (
        <div>
            <ClassNames>
                {({css, cx}) => (
                    <BumonSearchDialogBase
                        dialogClassName={css({width: 800, maxWidth: "none"})}
                    />
                )}
            </ClassNames>
        </div>
    );
};

type BumonSearchDialogBaseProp = {
    dialogClassName: string;
};

const BumonSearchDialogBase: React.FC<BumonSearchDialogBaseProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = grobalStore!.bumonSearchDialogProp;
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
                <Modal.Title>部門検索</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Row>
                        <Label width={100}>部署名：</Label>
                        <Text
                            width={180}
                            imeOff
                            {...createInputProp(store.bushoName!)}
                            readOnly={true}
                        />
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showBushoSearchDialog();
                                console.log(ret);
                                if (ret) {
                                    store.bushoCode!.value = ret.bushoCode;
                                    store.bushoName!.value = ret.bushoName;
                                }
                            }}
                        />
                    </Row>
                    <Row>
                        <Label width={100}>部門コード：</Label>
                        <Text width={100} imeOff {...createInputProp(store.bumonCode!)} />
                        <Label>部門名：</Label>
                        <Text width={100} {...createInputProp(store.bumonName!)} />
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
                        apiPath="bumon/list"
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
                                        return `<button class="btnSelect" data-busho-code='${
                                            row.bushoCode
                                            }' data-busho-name='${row.bushoName}' data-bumon-code='${
                                            row.bumonCode
                                            }' data-bumon-name='${row.bumonName}'>選択</button>`;
                                    }
                                },
                                {
                                    label: "部署コード",
                                    name: "bushoCode",
                                    width: 75,
                                    fixed: true
                                },
                                {label: "部署名", name: "bushoName", width: 90},
                                {
                                    label: "部門コード",
                                    name: "bumonCode",
                                    width: 75,
                                    fixed: true
                                },
                                {label: "部門名", name: "bumonName", width: 90}
                            ],
                            postData: createInputValueObject(store)
                        }}
                        onInitialized={(id: string) => {
                            $('#jqGrid' + id).on("click", ".btnSelect", e => {
                                store.show = false;
                                store.onClose &&
                                store.onClose({
                                    bushoCode: $(e.currentTarget).data("busho-code"),
                                    bushoName: $(e.currentTarget).data("busho-name"),
                                    bumonCode: $(e.currentTarget).data("bumon-code"),
                                    bumonName: $(e.currentTarget).data("bumon-name")
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
export default BumonSearchDialog;
