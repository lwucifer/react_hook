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

const UserSearchDialog: React.FC = prop => {
    return (
        <div>
            <ClassNames>
                {({css, cx}) => (
                    <UserSearchDialogBase
                        dialogClassName={css({width: 800, maxWidth: "none"})}
                    />
                )}
            </ClassNames>
        </div>
    );
};

type UserSearchDialogBaseProp = {
    dialogClassName: string;
};

const UserSearchDialogBase: React.FC<UserSearchDialogBaseProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = grobalStore!.userSearchDialogProp;
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
                <Modal.Title>ユーザー検索</Modal.Title>
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
                                    store.bumonCode!.value = "";
                                    store.bumonName!.value = "";
                                    store.teamCode!.value = "";
                                    store.teamName!.value = "";
                                }
                            }}
                        />
                    </Row>
                    <Row>
                        <Label width={100}>部門名：</Label>
                        <Text
                            width={180}
                            imeOff
                            {...createInputProp(store.bumonName!)}
                            readOnly={true}
                        />
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showBumonSearchDialog({
                                    bushoCode:
                                        (store && store.bushoCode && store.bushoCode.value) || "",
                                    bushoName:
                                        (store && store.bushoName && store.bushoName.value) || ""
                                });
                                if (ret) {
                                    store.bushoCode!.value = ret.bushoCode;
                                    store.bushoName!.value = ret.bushoName;
                                    store.bumonCode!.value = ret.bumonCode;
                                    store.bumonName!.value = ret.bumonName;
                                    store.teamCode!.value = "";
                                    store.teamName!.value = "";
                                }
                            }}
                        />
                    </Row>
                    <Row>
                        <Label width={100}>チーム名：</Label>
                        <Text
                            width={180}
                            imeOff
                            {...createInputProp(store.teamName!)}
                            readOnly={true}
                        />
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showTeamSearchDialog({
                                    bushoCode:
                                        (store && store.bushoCode && store.bushoCode.value) || "",
                                    bushoName:
                                        (store && store.bushoName && store.bushoName.value) || "",
                                    bumonCode:
                                        (store && store.bumonCode && store.bumonCode.value) || "",
                                    bumonName:
                                        (store && store.bumonName && store.bumonName.value) || ""
                                });
                                if (ret) {
                                    store.bushoCode!.value = ret.bushoCode;
                                    store.bushoName!.value = ret.bushoName;
                                    store.bumonCode!.value = ret.bumonCode;
                                    store.bumonName!.value = ret.bumonName;
                                    store.teamCode!.value = ret.teamCode;
                                    store.teamName!.value = ret.teamName;
                                }
                            }}
                        />
                    </Row>
                    <Row>
                        <Label width={100}>ユーザーID：</Label>
                        <Text width={100} imeOff {...createInputProp(store.userId!)} />
                        <Label>ユーザー名：</Label>
                        <Text width={100} {...createInputProp(store.userName!)} />
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
                        apiPath="user/list"
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
                                            }' data-bumon-name='${row.bumonName}' data-team-code='${
                                            row.teamCode
                                            }' data-team-name='${row.teamName}' data-user-id='${
                                            row.userId
                                            }' data-user-name='${row.userName}'>選択</button>`;
                                    }
                                },
                                {
                                    label: "ユーザーID",
                                    name: "userId",
                                    width: 100,
                                    fixed: true
                                },
                                {label: "ユーザー名", name: "userName", width: 90},
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
                                {label: "部門名", name: "bumonName", width: 90},
                                {
                                    label: "チームコード",
                                    name: "teamCode",
                                    width: 75,
                                    fixed: true
                                },
                                {label: "チーム名", name: "teamName", width: 90}
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
                                    bumonName: $(e.currentTarget).data("bumon-name"),
                                    teamCode: $(e.currentTarget).data("team-code"),
                                    teamName: $(e.currentTarget).data("team-name"),
                                    userId: $(e.currentTarget).data("user-id"),
                                    userName: $(e.currentTarget).data("user-name")
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
export default UserSearchDialog;
