import React from "react";
import { getEnvConfig } from "../env/EnvConfig";
import dayjs from "dayjs";
import $ from "jquery";
import Mime from "mime";
import { storeContext } from "../Context";
import { async } from "q";

export type ExceptionDetail = {
    message: string;
    propertyNames: Array<string>;
};

export type ErrorInfo = {
    message: string;
    details: Array<ExceptionDetail> | undefined;
};

export class ErrorResData {
    status = 0;
    errorInfo: ErrorInfo | undefined;

    isValidError = () => this.status === 400;
    isAuthError = () =>
        this.status === 401 || this.status === 403 || this.status === 405;
    isNotFountError = () => this.status === 404;
    isConflictError = () => this.status === 409;
    isSystemError = () => 500 <= this.status;
    isFetchError = () => this.status === -1;

    constructor(status: number, errorInfo: ErrorInfo | undefined) {
        this.status = status;
        this.errorInfo = errorInfo;
    }
}

export interface InputStore<T> {
    label: string;
    value: T | undefined;
    isInvalid: boolean;
}

export function isInputStore(obj: any) {
    return (
        obj !== null &&
        typeof obj === "object" &&
        typeof obj.label === "string" &&
        (typeof obj.value === "string" ||
            typeof obj.value === "boolean" ||
            typeof obj.value === "number" ||
            typeof obj.value === "undefined") &&
        typeof obj.isInvalid === "boolean"
    );
}

export function checkInputStoreType(obj: any) {
    return (
        typeof obj.value === "string" ||
        typeof obj.value === "boolean" ||
        typeof obj.value === "number"
    );
}

export function clearInvalidProp(store: any) {
    for (let propName in store) {
        if (store[propName] && store[propName]["isInvalid"] != undefined) {
            store[propName].isInvalid = false;
        }
    }
}

export function hasInvalidProp(store: any) {
    for (let propName in store) {
        if (store[propName]["isInvalid"] != undefined) {
            if (store[propName].isInvalid) {
                return true;
            }
        }
    }
    return false;
}

export function createInputProp<T>(store: InputStore<T>) {
    return {
        value: store.value,
        isInvalid: store.isInvalid,
        onChange: (value: T | undefined) => {
            store.value = value;
        }
    };
}

export function createInputStore<T>(label: string, value?: T | undefined) {
    return {
        label: label,
        value: value ? value : "",
        isInvalid: false
    } as InputStore<T>;
}

export function createInputValueObject(store: any) {
    let vo: any = {};
    for (let key in store) {
        if (isInputStore(store[key])) {
            vo[key] = store[key].value;
        }
    }
    return vo;
}

let fetchToken = "";

export function setFetchToken(token: string) {
    fetchToken = token;
    sessionStorage.setItem("fetchToken", token);
}

export function getFetchToken() {
    return fetchToken || sessionStorage.getItem("fetchToken") || "";
}

export type LoginUser = {
    loggedIn: boolean;
    userId: string;
    userName: string;
    bushoCode: string;
    bumonCode: string;
    teamCode: string;
    adminFlg: boolean;
};

export function setLoginUser(loginUser: LoginUser) {
    sessionStorage.setItem("loginUser", JSON.stringify(loginUser));
}

export function getLoginUser() {
    if (sessionStorage.getItem("loginUser") == null) {
        return;
    }
    return JSON.parse(sessionStorage.getItem("loginUser") || "");
}

let userId = "";

export function setUserId(id: string) {
    userId = id;
    sessionStorage.setItem("userId", userId);
}

export function getUserId() {
    return userId || sessionStorage.getItem("userId") || "";
}

let userName = "";

export function setUserName(name: string) {
    userName = name;
    sessionStorage.setItem("userName", userName);
}

export function getUserName() {
    return userName || sessionStorage.getItem("userName") || "";
}

export function logout() {
    sessionStorage.removeItem("fetchToken");
    sessionStorage.removeItem("loginUser");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userName");

    fetchToken = "";
    userId = "";
    userName = "";
}

export async function postRequest<T>(path: string, param?: any) {
    try {
        let res = await fetch(`${getEnvConfig().apiUrl}${path}`, {
            mode: "cors",
            credentials: "include",
            method: "post",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "X-Authorization-Token": getFetchToken()
            },
            body: param && JSON.stringify(param)
        });

        if (res.ok) {
            let bodyText = await res.text();
            if (bodyText) {
                return JSON.parse(bodyText) as T;
            } else {
                return {} as T;
            }
            //return (await res.json()) as T;
        } else {
            let errorInfo = (await res.json()) as ErrorInfo;
            return new ErrorResData(res.status, errorInfo);
        }
    } catch (e) {
        return new ErrorResData(-1, {
            message: "サーバーとの通信に失敗しました。",
            details: []
        });
    }
}

export function removeComma(str: string | undefined) {
    if (!str) {
        return "";
    }
    return str.replace(/,/g, "");
}

export function separateByComma(num: number | undefined) {
    if (num === 0) {
        return String(num);
    }
    if (!num) {
        return "";
    }
    if (Number.isNaN(num)) {
        return "";
    }
    return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

export function isInteger(str: string | undefined) {
    if (!str) {
        return false;
    }
    return /^[-]?\d*$/.test(str);
}

export function arrayRemove(array: any, value: any) {
    let what,
        a = arguments,
        L = a.length,
        ax;
    while (L && array.length) {
        what = a[--L];
        while ((ax = array.indexOf(what)) !== -1) {
            array.splice(ax, 1);
        }
    }

    return array;
}

export function covertToInt(str: any) {
    if (str === '-') return str;
    return parseInt(String(str), 10);
}

export function resetStore(store: any) {
    let tmpStore: any = store;
    for (let key in tmpStore) {
        if (isInputStore(tmpStore[key])) {
            tmpStore[key].value = "";
        }
    }
}

export function setStore2Store(store: any, data: any) {
    let tmpStore: any = store;
    for (let key in tmpStore) {
        if (isInputStore(tmpStore[key])) {
            tmpStore[key].value = data[key].value;
        } else {
            if (data[key]) {
                tmpStore[key] = data[key];
            }
            if (key == "id") tmpStore.id = data.id;
        }
    }
}

export function setData2Store(store: any, data: any) {
    let tmpStore: any = store;
    for (let key in tmpStore) {
        if (isInputStore(tmpStore[key])) {
            tmpStore[key].value = data[key];
        } else {
            if (data[key]) {
                tmpStore[key] = data[key];
            }
            if (key == "id") tmpStore.id = data.id;
            //if(typeof tmpStore[key] == 'boolean') tmpStore[key] = data[key];
        }
    }
}

export function isDecimal(
    str: string | undefined,
    precision?: number | undefined,
    scale?: number | undefined
) {
    if (!str) {
        return false;
    }

    if (precision) {
        let sc = scale || 0;
        let reg = "^([1-9][0-9]{0," + (precision - sc - 1) + "}|0)";
        if (sc > 0) {
            reg += "(\\.[0-9]{1," + sc + "})";
        }
        reg += "?$";

        return new RegExp(reg).test(str);
    } else {
        return /^[+,-]?\d(\.\d+)?$/.test(str);
    }
}

export function validateDate(
    fromname: any,
    toname: any,
    e: any,
    isFrom: boolean | undefined,
    store: any
) {
    let tmpStore: any = store;
    let from = tmpStore[fromname].value;
    let to = tmpStore[toname].value;
    let target = formatDate(e, "yyyy/mm");
    let dVal = dayjs(target);
    if (dVal.isValid()) {
        from = parseInt(
            String(from)
                .replace("/", "")
                .replace("/", ""),
            10
        );
        to = parseInt(
            String(to)
                .replace("/", "")
                .replace("/", ""),
            10
        );
        if (from > to) {
            if (isFrom) {
                tmpStore[toname].value = "";
            } else {
                tmpStore[fromname].value = "";
            }
        }
    }
}

export function formatDate(
    val: string | undefined,
    type: string | undefined = ""
) {
    if (!val) {
        return "";
    }
    let strs = val.split("/");
    let target = "";
    let now = dayjs(Date.now());

    let year = "";
    let month = "";
    let day = "";

    if (type === "yyyy/mm/dd") {
        year = `${val.substr(0, 4)}`;
        month = val.substr(5, 2);
        day = val.substr(8, 2);
        target = `${year}/${month}/${day}`;
        let dVal = dayjs(target);
        return dVal.isValid() ? target : "";
    }

    if (type === "yyyymm") {
        year = `${val.substr(0, 4)}`;
        month = val.substr(4, 2);
        target = `${year}/${month}`;
        let dVal = dayjs(target);
        return dVal.isValid() ? target : "";
    }

    if (type === "yyyy/mm") {
        year = `${val.substr(0, 4)}`;
        month = val.substr(val.indexOf("/") >= 0 ? 5 : 4, 2);
        target = `${year}/${month}`;
        let dVal = dayjs(target);
        return dVal.isValid() ? target : "";
    }

    if (strs.length === 1) {
        if (val.length === 8) {
            year = val.substr(0, 4);
            month = val.substr(4, 2);
            day = val.substr(6, 2);
            return `${year}/${month}/${day}`;
        }
        if (val.length === 7) {
            year = val.substr(0, 4);
            month = val.substr(4, 2);
            day = val.substr(6, 2).padStart(2, "0");
            return `${year}/${month}/${day}`;
        }
        if (val.length === 6) {
            year = `20${val.substr(0, 2)}`;
            month = val.substr(2, 2);
            day = val.substr(4, 2);
            return `${year}/${month}/${day}`;
        }
        if (val.length === 5) {
            year = `20${val.substr(0, 2)}`;
            month = val.substr(2, 2);
            day = val.substr(4, 1).padStart(2, "0");
            return `${year}/${month}/${day}`;
        }
        if (val.length === 4) {
            year = now.year() + "";
            month = val.substr(0, 2);
            day = val.substr(2, 2);
            return `${year}/${month}/${day}`;
        }
        if (val.length <= 2) {
            year = now.year() + "";
            month = now.month() + 1 + "";
            day = val.padStart(2, "0");
            return `${year}/${month}/${day}`;
        }
    } else {
        if (strs.length === 2) {
            year = now.year() + "";
            month = strs[0].padStart(2, "0");
            day = strs[1].padStart(2, "0");
            return `${year}/${month}/${day}`;
        }
        if (strs.length === 3) {
            if (strs[0].length === 4) {
                year = strs[0];
                month = strs[1].padStart(2, "0");
                day = strs[2].padStart(2, "0");
                return `${year}/${month}/${day}`;
            }
            if (strs[0].length === 2) {
                year = "20" + strs[0];
                month = strs[1].padStart(2, "0");
                day = strs[2].padStart(2, "0");
                return `${year}/${month}/${day}`;
            }
        }
    }
    return "";
}

export function downloadFile(base64: string, fileName: string) {
    let mime_ctype = Mime.getType(fileName);
    if (!mime_ctype) {
        mime_ctype = "application/octet-stream";
    }
    let blob = toBlob(base64, mime_ctype);

    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
        let dlTab = document!.getElementById("downloadField"); // baseLayout
        dlTab!.setAttribute("download", fileName);
        dlTab!.setAttribute("href", window.URL.createObjectURL(blob));
        dlTab!.click();
    }
}

export function toBlob(base64: string, mime_ctype: string) {
    let bin = atob(base64.replace(/^.*,/, ""));
    let buffer = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    try {
        var blob = new Blob([buffer], {
            type: mime_ctype
        });
    } catch (e) {
        return false;
    }
    return blob;
}

export async function download(path: any, store: any, grobalStore: any) {
    if ( !(await grobalStore!.showConfirm( "ダウンロード？" )) ) {
        return;
    }

    let sendData = createInputValueObject(store);
    let res = await postRequest<{
        fileName: string;
        fileData: string;
    }>(path, sendData);

    if (res instanceof ErrorResData) {
        await grobalStore!.showInvalidAlert(res, store);
        return;
    }

    downloadFile(res.fileData, res.fileName);
}

export async function downloadNoConfirm(path: any, store: any, grobalStore: any) {
    let sendData = createInputValueObject(store);
    let res = await postRequest<{
        fileName: string;
        fileData: string;
    }>(path, sendData);

    if (res instanceof ErrorResData) {
        await grobalStore!.showInvalidAlert(res, store);
        return;
    }

    downloadFile(res.fileData, res.fileName);
    resetStore(store);
}

export async function checkTaxRate(e: any, store: any, grobalStore: any) {
    store.taxRate.isInvalid = false;
    var res = await postRequest<{ }>(
        "check/taxRate",
        {taxRate: covertToInt(e) ? covertToInt(e) : 0}
    );
    if (res instanceof ErrorResData) {
        await grobalStore!.showInvalidAlert(res, store);
        store.taxRate.value = '0';
        return false;
    }

    store.taxRate.value = e;
    if (!e) store.taxRate.value = '0';
}

export async function nextValue(x: any) {
    if (x === false) return x;
    x++;
    nextValue(x);
}

export default {
    clearInvalidProp,
    createInputStore,
    createInputProp,
    createInputValueObject,
    hasInvalidProp,
    getFetchToken,
    postRequest,
    ErrorResData,
    removeComma,
    separateByComma,
    isInteger,
    isDecimal,
    formatDate,
    setUserId,
    getUserId,
    getUserName,
    setUserName,
    arrayRemove,
    covertToInt,
    resetStore,
    setData2Store,
    setStore2Store,
    validateDate,
    downloadFile,
    toBlob,
    download,
    downloadNoConfirm,
    checkTaxRate,
    setLoginUser,
    getLoginUser,
    logout
};
