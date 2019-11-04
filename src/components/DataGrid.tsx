import React, {
    useEffect,
    forwardRef,
    useRef,
    useImperativeHandle
} from "react";
import {getEnvConfig} from "../env/EnvConfig";
import $ from "jquery";
import "free-jqgrid";
import "free-jqgrid/dist/i18n/grid.locale-ja";
import "free-jqgrid/dist/css/ui.jqgrid.min.css";
import AppUtils, {clearInvalidProp, ErrorInfo, ErrorResData} from "../utils/AppUtils";
import _ from "lodash";

/** @jsx jsx */
import {jsx} from "@emotion/core";
import {storeContext} from "../Context";

export const jsxBabelFix = jsx;

export interface GridHandler {
    reloadgrid(postData?: any): any;
}

type DataGridProp = {
    options?: FreeJqGrid.JqGridOptions;
    apiPath?: string;
    store?: any;
    onInitialized?: (id: string) => void;
};

const DataGrid = forwardRef<GridHandler, DataGridProp>((prop, ref) => {
    const grobalStore = React.useContext(storeContext);
    const mountRef = useRef({isMount: false, id: ""}).current;
    if (!mountRef.isMount) {
        mountRef.isMount = true;
        mountRef.id = _.uniqueId();
    }

    useImperativeHandle(ref, () => ({
        async reloadgrid(postData?: any) {
            if (postData) {
                $(`#jqGrid${mountRef.id}`).setGridParam!({
                    postData: null
                });

                $(`#jqGrid${mountRef.id}`).setGridParam!({
                    postData: postData
                });
            }
            $(`#jqGrid${mountRef.id}`).trigger("reloadGrid");
        }
    }));

    useEffect(() => {
        let options = _.extend(
            {
                jsonReader: {
                    repeatitems: false,
                    id: "id"
                },
                ajaxGridOptions: {
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json",
                        "X-Authorization-Token": AppUtils.getFetchToken()
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true
                },
                datatype: "local",
                mtype: "post",
                url: prop.apiPath ? `${getEnvConfig().apiUrl}${prop.apiPath}` : "",
                viewrecords: true, // show the current page, data rang and total records on the toolbar
                autowidth: true,
                shrinkToFit: true,
                height: 400,
                rowNum: 50,
                loadonce : true,
                pager: `jqGridPager${mountRef.id}`,
                onRightClickRow: function () {
                    $(`#jqGrid${mountRef.id}`).jqGrid('resetSelection');
                    return false;
                },
                serializeGridData: function (postData: any) {
                    return JSON.stringify(postData);
                },
                beforeSelectRow: function (rowid: any, e: any) {
                    return false;
                },
                loadError: function (data: any) {
                    clearInvalidProp(prop.store);
                    let errorInfo = (data.responseJSON) as ErrorInfo;
                    let res = new ErrorResData(data.status, errorInfo);
                    grobalStore!.showInvalidAlert(res, prop.store);
                },
                loadComplete: function () {
                    clearInvalidProp(prop.store);
                },
                gridComplete: function () { },
                beforeProcessing: function (data: any) {
                    if( !data.records || data.records === 0 ){
                        grobalStore!.showAlert("データが取得できませんでした。");
                    }
                }
            },
            prop.options
        );
        $(`#jqGrid${mountRef.id}`).jqGrid!(options);
        prop.onInitialized && prop.onInitialized(mountRef.id);
    }, []);

    return (
        <div id={mountRef.id}>
            <table id={`jqGrid${mountRef.id}`}/>
            <div id={`jqGridPager${mountRef.id}`}/>
        </div>
    );
});
export default DataGrid;
