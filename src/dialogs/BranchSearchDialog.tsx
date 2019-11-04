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

const BranchSearchDialog: React.FC = prop => {
    return (
        <div>
            <ClassNames>
                {({css, cx}) => (
                    <BranchSearchDialogBase
                        dialogClassName={css({width: 800, maxWidth: "none"})}
                    />
                )}
            </ClassNames>
        </div>
    );
};

type BranchSearchDialogBaseProp = {
    dialogClassName: string;
};

const BranchSearchDialogBase: React.FC<BranchSearchDialogBaseProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = grobalStore!.branchSearchDialogProp;
    const gridRef = useRef({} as GridHandler);
    const localStore = useLocalStore(() => ({
        show: true,
    }));
    return useObserver(() => (
        <Modal
            show={store.show}
            dialogClassName={prop.dialogClassName}
            onHide={() => {}}
        >
            <Modal.Header>
                <Modal.Title>MH支店検索</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Row>
                        <Label width={100}>部署コード：</Label>
                        <Text width={100} imeOff {...createInputProp(store.labelName!)} />
                        <Label>部署名：</Label>
                        <Text width={100} {...createInputProp(store.branchName!)} />
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
                        apiPath="branch/list"
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
                    data-label='${row.labelName}' 
                    data-name='${row.branchName}'
                    data-code='${row.buyerCode}'
                    >選択</button>`;
                                    }
                                },
                                {
                                    label: "部署コード",
                                    name: "buyerCode",
                                    width: 90,
                                    fixed: true
                                },
                                {label: "部署名", name: "branchName", width: 90},
                                {label: "部署名", name: "labelName", width: 90}
                            ],
                            postData: createInputValueObject(store)
                        }}
                        onInitialized={(id: string) => {
                            $('#jqGrid' + id).on("click", ".btnSelect", e => {
                                store.show = false;
                                store.onClose &&
                                store.onClose({
                                    labelName: $(e.currentTarget).data("label"),
                                    buyerCode: $(e.currentTarget).data("code"),
                                    branchName: $(e.currentTarget).data("name")
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
export default BranchSearchDialog;
