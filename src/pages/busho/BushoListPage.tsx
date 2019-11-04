import React, {useRef} from "react";
import {BushoPageStore} from "./BushoPage";
import DataGrid, {GridHandler} from "../../components/DataGrid";
import Button from "../../components/Button";
import $ from "jquery";

/** @jsx jsx */
import {jsx} from "@emotion/core";

export const jsxBabelFix = jsx;

type BushoListPageProp = {
    parentStore: BushoPageStore;
};
const BushoListPage: React.FC<BushoListPageProp> = prop => {
    const gridRef = useRef({} as GridHandler);
    return (
        <div>
            <Button onClick={() => prop.parentStore.setMode("create")}>
                新規作成
            </Button>
            <div>
                <DataGrid
                    ref={gridRef}
                    apiPath="busho/list"
                    options={{
                        datatype: "json",
                        colModel: [
                            {
                                align: "center",
                                label: "部署コード",
                                name: "bushoCode",
                                width: 90,
                                fixed: true,
                                formatter: (val, opt, row) => {
                                    return `<button class="btnSelect btn btn-link" data-id='${row.id}'>${row.bushoCode}</button>`;
                                }
                            },
                            {label: "部署名", name: "bushoName"},
                            {
                                align: "center",
                                label: "システム管理者権限",
                                name: "adminFlg",
                                formatter: (val) => {
                                    return val ? "〇" : "";
                                }
                            }
                        ]
                    }}
                    onInitialized={(id: string) => {
                        $(`#${id}`).on("click", ".btnSelect", e => {
                            prop.parentStore.idSelected($(e.currentTarget).data("id"));
                        });
                    }}
                />
            </div>
        </div>
    );
};
export default BushoListPage;
