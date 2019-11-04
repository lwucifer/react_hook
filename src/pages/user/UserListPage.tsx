import React, {useRef} from "react";
import {UserPageStore} from "./UserPage";
import DataGrid, {GridHandler} from "../../components/DataGrid";
import Button from "../../components/Button";
import $ from "jquery";

/** @jsx jsx */
import {jsx} from "@emotion/core";
import Row from "../../components/Row";
import Label from "../../components/Label";
import Text from "../../components/Text";
import {
    createInputProp,
    createInputValueObject,
    ErrorResData,
    postRequest
} from "../../utils/AppUtils";
import {storeContext} from "../../Context";
import {useLocalStore, useObserver} from "mobx-react-lite";

export const jsxBabelFix = jsx;
type Busho = {
    id: number;
    bushoCode: string;
    bushoName: string;
};
type Bumon = {
    id: number;
    bumonCode: string;
    bumonName: string;
};
type Team = {
    id: number;
    teamCode: string;
    teamName: string;
};
type UserListPageProp = {
    parentStore: UserPageStore;
};
const UserListPage: React.FC<UserListPageProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = grobalStore!.userSearchDialogProp;
    const localStore = useLocalStore(() => ({
        show: false,
    }));
    const gridRef = useRef({} as GridHandler);
    return useObserver(() => (
        <div>
            <div>
                <div className="form">
                    <Row>
                        <Label width={150}>部署：</Label>
                        <Text
                            width={100}
                            maxLength={3}
                            imeOff
                            {...createInputProp(store.bushoCode!)}
                            onChange={async (e) => {
                                store.bushoName!.value = "";
                                store.bushoCode!.value = e;
                                var res = await postRequest<{ busho: Busho; }>(
                                    "busho/getOneBushoCode",
                                    {bushoCode: e}
                                );
                                if ( !(res instanceof ErrorResData) ) {
                                    let busho = res.busho;
                                    store.bushoName!.value = busho.bushoName;
                                }
                            }}
                        />
                        <Button
                            className="fa fa-search mr-5px"
                            onClick={async () => {
                                const ret = await grobalStore!.showBushoSearchDialog();
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
                        <Text
                            width={180}
                            imeOff
                            {...createInputProp(store.bushoName!)}
                            readOnly={true}
                        />
                    </Row>
                    <Row>
                        <Label width={150}>部門：</Label>
                        <Text
                            width={100}
                            maxLength={4}
                            imeOff
                            {...createInputProp(store.bumonCode!)}
                            onChange={async (e) => {
                                store.bumonName!.value = "";
                                store.bumonCode!.value = e;
                                var res = await postRequest<{ bumon: Bumon; }>(
                                    "bumon/getOneBumonCode",
                                    {bumonCode: e}
                                );
                                if ( !(res instanceof ErrorResData) ) {
                                    let bumon = res.bumon;
                                    store.bumonName!.value = bumon.bumonName;
                                }
                            }}
                        />
                        <Button
                            className="fa fa-search mr-5px"
                            onClick={async () => {
                                const ret = await grobalStore!.showBumonSearchDialog({
                                    bushoCode: (store && store.bushoCode && store.bushoCode.value) || "",
                                    bushoName: (store && store.bushoName && store.bushoName.value) || ""
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
                        <Text
                            width={180}
                            imeOff
                            {...createInputProp(store.bumonName!)}
                            readOnly={true}
                        />
                    </Row>
                    <Row>
                        <Label width={150}>チーム：</Label>
                        <Text
                            width={100}
                            imeOff
                            maxLength={4}
                            {...createInputProp(store.teamCode!)}
                            onChange={async (e) => {
                                store.teamName!.value = "";
                                store.teamCode!.value = e;
                                var res = await postRequest<{ team: Team; }>(
                                    "team/getOneTeamCode",
                                    {teamCode: e}
                                );
                                if ( !(res instanceof ErrorResData) ) {
                                    let team = res.team;
                                    store.teamName!.value = team.teamName;
                                }
                            }}
                        />
                        <Button
                            className="fa fa-search mr-5px"
                            onClick={async () => {
                                const ret = await grobalStore!.showTeamSearchDialog({
                                    bushoCode: (store && store.bushoCode && store.bushoCode.value) || "",
                                    bushoName: (store && store.bushoName && store.bushoName.value) || "",
                                    bumonCode: (store && store.bumonCode && store.bumonCode.value) || "",
                                    bumonName: (store && store.bumonName && store.bumonName.value) || ""
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
                        <Text
                            width={180}
                            imeOff
                            {...createInputProp(store.teamName!)}
                            readOnly={true}
                        />
                    </Row>
                    <Row>
                        <Label width={150}>ユーザーID：</Label>
                        <Text width={150} imeOff {...createInputProp(store.userId!)} />
                        <Label width={150}> ユーザー名：</Label>
                        <Text width={150} {...createInputProp(store.userName!)} />
                        <Button
                            variant="primary"
                            onClick={() => {
                                if (!localStore.show) {
                                    localStore.show = true;
                                } else {
                                    localStore.show = false;
                                    setTimeout(function () {
                                        localStore.show = true;
                                        gridRef!.current.reloadgrid(createInputValueObject(store));
                                    }, 1);
                                }
                            }}
                        >検索</Button>
                    </Row>
                </div>
                <Button onClick={() => prop.parentStore.setMode("create")}>新規作成</Button>
                {localStore.show &&
                <DataGrid
                    ref={gridRef}
                    apiPath="user/list"
                    options={{
                        datatype: "json",
                        colModel: [
                            {
                                label: "ユーザーID",
                                name: "userId",
                                formatter: (val, opt, row) => {
                                    return `<button class="btnSelect btn btn-link" data-id='${row.id}'>${row.userId}</button>`;
                                }
                            },
                            {label: "ユーザー名", name: "userName"},
                            {label: "部署名", name: "bushoName"},
                            {label: "部門名", name: "bumonName"},
                            {label: "チーム名", name: "teamName"}
                        ],
                        postData: createInputValueObject(store)
                    }}
                    onInitialized={(id: string) => {
                        $(`#${id}`).on("click", ".btnSelect", e => {
                            prop.parentStore.idSelected($(e.currentTarget).data("id"));
                        });
                    }}
                />
                }
            </div>
        </div>
    ));
};
export default UserListPage;
