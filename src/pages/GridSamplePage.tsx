import React, {
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle
} from "react";
import $ from "jquery";
import "free-jqgrid";
import "free-jqgrid/dist/i18n/grid.locale-ja";
import AppUtils from "../utils/AppUtils";

/** @jsx jsx */
import { jsx, css } from "@emotion/core";
export const jsxBabelFix = jsx;

export interface GridHandler {
  reloadgrid(): void;
}

type GridSamplePageProp = {};

const GridSamplePage = forwardRef<GridHandler>((prop, ref) => {
  useImperativeHandle(ref, () => ({
    reloadgrid() {
      alert("getAlert from Child");
    }
  }));

  useEffect(() => {
    $("#jqGrid").jqGrid!({
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
      url: "",
      colModel: [
        { label: "項目１", name: "aaa", width: 75 },
        { label: "項目２", name: "bbb", width: 90 }
      ],
      viewrecords: true, // show the current page, data rang and total records on the toolbar
      width: 780,
      height: 200,
      rowNum: 10,
      pager: "#jqGridPager",
      gridComplete: function() {
        console.log("gridComplete");
      }
    });
  }, []);

  return (
    <div>
      <table id="jqGrid" />
      <div id="jqGridPager" />
    </div>
  );
});
export default GridSamplePage;
