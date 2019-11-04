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
import {jsx, ClassNames} from "@emotion/core";

export const jsxBabelFix = jsx;

const TorihikisakiSearchDialog: React.FC = prop => {
    return (
        <div>
            <ClassNames>
                {({css, cx}) => (
                    <TorihikisakiSearchDialogBase
                        dialogClassName={css({width: 800, maxWidth: "none"})}
                    />
                )}
            </ClassNames>
        </div>
    );
};

type TorihikisakiSearchDialogBaseProp = {
    dialogClassName: string;
};

const TorihikisakiSearchDialogBase: React.FC<TorihikisakiSearchDialogBaseProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = grobalStore!.torihikisakiSearchDialogProp;
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
                <Modal.Title>取引先検索</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Row>
                        <Label>区分</Label>
                        <Text
                            width={100}
                            readOnly={true}
                            value={store.kbn === "MH" ? "MH" : "社外"}
                        />
                        <Label>取引先コード：</Label>
                        <Text
                            width={100}
                            imeOff
                            {...createInputProp(store.torihikisakiCode!)}
                        />
                        <Label>取引先名：</Label>
                        <Text width={100} {...createInputProp(store.torihikisakiName!)} />
                        <Button
                            variant="primary"
                            onClick={() => {
                                localStore.show = false;
                                setTimeout(function () {
                                    localStore.show = true;
                                    gridRef.current.reloadgrid(
                                        Object.assign(
                                            {kbn: store.kbn === "MH" ? "0" : "1"},
                                            createInputValueObject(store)
                                        )
                                    );
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
                        apiPath="torihikisaki/list"
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
data-code='${row.torihikisakiCode}' 
data-abbr='${row.torihikisakiAbbrName}' 
data-name='${row.torihikisakiName}'>選択</button>`;
                                    }
                                },
                                {
                                    label: "取引先コード",
                                    name: "torihikisakiCode",
                                    width: 75,
                                    fixed: true
                                },
                                {label: "取引先名（正式）", name: "torihikisakiName", width: 90},
                                {label: "取引先名（略名）", name: "torihikisakiAbbrName", width: 90}
                            ],
                            postData: Object.assign(
                                {kbn: store.kbn === "MH" ? "0" : "1"},
                                createInputValueObject(store)
                            )
                        }}
                        onInitialized={(id: string) => {
                            $('#jqGrid' + id).on("click", ".btnSelect", e => {
                                store.show = false;
                                store.onClose &&
                                store.onClose({
                                    kbn: store.kbn,
                                    torihikisakiAbbrName: $(e.currentTarget).data("abbr"),
                                    torihikisakiCode: $(e.currentTarget).data("code"),
                                    torihikisakiName: $(e.currentTarget).data("name")
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
export default TorihikisakiSearchDialog;
