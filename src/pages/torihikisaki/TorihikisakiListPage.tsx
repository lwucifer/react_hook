import React, {useRef} from "react";
import {TorihikisakiPageStore} from "./TorihikisakiPage";
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

type TorihikisakiListPageProp = {
    parentStore: TorihikisakiPageStore;
};

type Torihikisaki = {
    id: number;
    torihikisakiName: string;
    torihikisakiCode: string;
};
const TorihikisakiListPage: React.FC<TorihikisakiListPageProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = grobalStore!.torihikisakiSearchDialogProp;
    const localStore = useLocalStore(() => ({
        show: false,
    }));
    const gridRef = useRef({} as GridHandler);
    return useObserver(() => (
        <div>
            <div className="form">
                <Row>
                    <Label width={150}>取引先コード ：</Label>
                    <Text width={100} maxLength={6} imeOff {...createInputProp(store.torihikisakiCode!)}
                        onChange={async (e) => {
                            store.torihikisakiName!.value = "";
                            store.torihikisakiCode!.value = e;
                            var res = await postRequest<{ torihikisaki: Torihikisaki; }>(
                              "torihikisaki/getOneTorihikisakiCode",
                              {torihikisakiCode: e}
                            );
                            if (!(res instanceof ErrorResData)) {
                              let busho = res.torihikisaki;
                              store.torihikisakiName!.value = busho.torihikisakiName;
                            }
                        }}/>
                </Row>
                <Row>
                    <Label width={150}>取引先名（略名） ：</Label>
                    <Text width={200} {...createInputProp(store.torihikisakiName!)} />
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
                apiPath="torihikisaki/list"
                options={{
                    datatype: "json",
                    colModel: [
                        {
                            label: "取引先コード",
                            name: "torihikisakiCode",
                            formatter: (val, opt, row) => {
                                return `<button class="btnSelect btn btn-link" data-id='${row.id}'>${row.torihikisakiCode}</button>`;
                            }
                        },
                        {label: "取引先名（正式）", name: "torihikisakiName"},
                        {label: "取引先名（略名）", name: "torihikisakiAbbrName"},
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
    ));
};
export default TorihikisakiListPage;
