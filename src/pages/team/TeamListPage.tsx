import React, {useRef} from "react";
import {TeamPageStore} from "./TeamPage";
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
type TeamListPageProp = {
    parentStore: TeamPageStore;
};
const TeamListPage: React.FC<TeamListPageProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = grobalStore!.teamSearchDialogProp;
    const localStore = useLocalStore(() => ({
        show: false,
    }));
    const gridRef = useRef({} as GridHandler);
    return useObserver(() => (
        <div>
            <div>
                <div className="form">
                    <Row>
                        <Label width={100}> 部署：</Label>
                        <Text width={100} {...createInputProp(store.bushoCode!)}
                              maxLength={3}
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
                              }}/>
                        <Button
                            className="fa fa-search mr-5px"
                            onClick={async () => {
                                const ret = await grobalStore!.showBushoSearchDialog();
                                if (ret) {
                                    store.bushoCode!.value = ret.bushoCode;
                                    store.bushoName!.value = ret.bushoName;
                                    store.bumonCode!.value = "";
                                    store.bumonName!.value = "";
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
                        <Label width={100}>部門：</Label>
                        <Text
                            width={100}
                            imeOff
                            maxLength={4}
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
                                }
                            }}
                        />
                        <Text
                            width={180}
                            imeOff
                            {...createInputProp(store.bumonName!)}
                            readOnly={true}
                        />
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
                    apiPath="team/list"
                    options={{
                        datatype: "json",
                        colModel: [
                            {label: "部署名", name: "bushoName", width: 90},
                            {label: "部門名", name: "bumonName", width: 90},
                            {
                                align: "center",
                                label: "チームコード",
                                name: "teamCode",
                                width: 90,
                                fixed: true,
                                formatter: (val, opt, row) => {
                                    return `<button class="btnSelect btn btn-link" data-id='${row.id}'>${row.teamCode}</button>`;
                                }
                            },
                            {label: "チーム名", name: "teamName", width: 90},
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
export default TeamListPage;
