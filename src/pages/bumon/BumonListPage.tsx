import React, {useRef} from "react";
import {BumonPageStore} from "./BumonPage";
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

type BumonListPageProp = {
    parentStore: BumonPageStore;
};

const BumonListPage: React.FC<BumonListPageProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = grobalStore!.bumonSearchDialogProp;
    const localStore = useLocalStore(() => ({
        show: false,
    }));
    const gridRef = useRef({} as GridHandler);
    return useObserver(() => (
        <div>
            <div>
                <div className="form">
                    <Row>
                        <Label width={100}>部署：</Label>
                        <Text width={100}
                              maxLength={3}
                              {...createInputProp(store.bushoCode!)}
                              onChange={async (e) => {
                                  store.bushoName!.value = "";
                                  store.bushoCode!.value = e;
                                  var res = await postRequest<{ busho: Busho; }>(
                                      "busho/getOneBushoCode",
                                      {bushoCode: e}
                                  );
                                  if (!(res instanceof ErrorResData)) {
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
                                }
                            }}
                        />
                        <Text
                            width={180}
                            imeOff
                            {...createInputProp(store.bushoName!)}
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
                    apiPath="bumon/list"
                    options={{
                        datatype: "json",
                        colModel: [
                            {label: "部署名", name: "bushoName", sortable: true},
                            {
                                align: "center",
                                label: "部門コード",
                                name: "bumonCode",
                                width: 90,
                                sortable: true,
                                fixed: true,
                                formatter: (val, opt, row) => {
                                    return `<button class="btnSelect btn btn-link" data-id='${row.id}'>${row.bumonCode}</button>`;
                                }
                            },
                            {label: "部門名", name: "bumonName", sortable: true},
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
export default BumonListPage;
