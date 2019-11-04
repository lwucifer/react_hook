import React, {ReactNode} from "react";
import _ from "lodash";
import AppUtils, {
    ErrorResData,
    isInputStore,
    createInputStore,
    InputStore,
    LoginUser
} from "./utils/AppUtils";

type AlertProp = {
    show?: boolean | undefined;
    onClose?: (() => void) | undefined;
    Title?: string | undefined;
    Body?: ReactNode | undefined;
    ButtonLabel?: string;
};

type ConfirmProp = {
    show?: boolean | undefined;
    status?: boolean | undefined;
    onClose?: ((result: boolean) => void) | undefined;
    Title?: string | undefined;
    Body?: ReactNode | undefined;
    OK_ButtonLabel?: string;
    NG_ButtonLabel?: string;
};

type BushoSearchDialogProp = {
    show?: boolean | undefined;
    bushoCode?: InputStore<string>;
    bushoName?: InputStore<string>;
    adminFlg?: boolean;
    onClose?: ((result: BushoSearchDialogParam | null) => void) | undefined;
};

type BushoSearchDialogParam = {
    adminFlg?: boolean;
    bushoCode?: string;
    bushoName?: string;
};

type BumonSearchDialogProp = {
    show?: boolean | undefined;
    bushoCode?: InputStore<string>;
    bushoName?: InputStore<string>;
    bumonCode?: InputStore<string>;
    bumonName?: InputStore<string>;
    onClose?: ((result: BumonSearchDialogParam | null) => void) | undefined;
};

type BumonSearchDialogParam = {
    bushoCode?: string;
    bushoName?: string;
    bumonCode?: string;
    bumonName?: string;
};

type TeamSearchDialogProp = {
    show?: boolean | undefined;
    bushoCode?: InputStore<string>;
    bushoName?: InputStore<string>;
    bumonCode?: InputStore<string>;
    bumonName?: InputStore<string>;
    teamCode?: InputStore<string>;
    teamName?: InputStore<string>;
    onClose?: ((result: TeamSearchDialogParam | null) => void) | undefined;
};

type TeamSearchDialogParam = {
    bushoCode?: string;
    bushoName?: string;
    bumonCode?: string;
    bumonName?: string;
    teamCode?: string;
    teamName?: string;
};

type UserSearchDialogProp = {
    show?: boolean | undefined;
    bushoCode?: InputStore<string>;
    bushoName?: InputStore<string>;
    bumonCode?: InputStore<string>;
    bumonName?: InputStore<string>;
    teamCode?: InputStore<string>;
    teamName?: InputStore<string>;
    userId?: InputStore<string>;
    userName?: InputStore<string>;
    onClose?: ((result: UserSearchDialogParam | null) => void) | undefined;
};

type UserSearchDialogParam = {
    bushoCode?: string;
    bushoName?: string;
    bumonCode?: string;
    bumonName?: string;
    teamCode?: string;
    teamName?: string;
    userId?: string;
    userName?: string;
};

type TorihikisakiSearchDialogProp = {
    show?: boolean | undefined;
    kbn: "MH" | "OTHER";
    torihikisakiCode?: InputStore<string>;
    torihikisakiName?: InputStore<string>;
    torihikisakiAbbrName?: InputStore<string>;
    onClose?:
        | ((result: TorihikisakiSearchDialogParam | null) => void)
        | undefined;
};

type TorihikisakiSearchDialogParam = {
    kbn: "MH" | "OTHER";
    torihikisakiCode?: string;
    torihikisakiName?: string;
    torihikisakiAbbrName?: string;
};

type BuyerSearchDialogProp = {
    show?: boolean | undefined;
    kbn: "MH" | "OTHER";
    buyerCd?: InputStore<string>;
    buyerName?: InputStore<string>;
    buyerAbbrName?: InputStore<string>;
    onClose?:
        | ((result: BuyerSearchDialogParam | null) => void)
        | undefined;
};

type BuyerSearchDialogParam = {
    kbn: "MH" | "OTHER";
    buyerCd?: string;
    buyerName?: string;
    buyerAbbrName?: string;
};

type BranchSearchDialogProp = {
    show?: boolean | undefined;
    buyerCode?: InputStore<string>;
    branchName?: InputStore<string>;
    labelName?: InputStore<string>;
    onClose?: ((result: BranchSearchDialogParam | null) => void) | undefined;
};

type BranchSearchDialogParam = {
    branchCode?: string;
    branchName?: string;
    buyerCode?: string;
    buyerName?: string;
    labelName?: string;
};

type OrderItemSearchDialogProp = {
    show?: boolean | undefined;
    onClose?: ((result: OrderItemSearchDialogParam | null) => void) | undefined;
};

type OrderItemSearchDialogParam = {
    orderItemCode?: string;
    orderItemName?: string;
};


export const createStore = () => {

    const loginUser  = AppUtils.getLoginUser() || {
        loggedIn: false,
        userId: "",
        userName: "",
        bushoCode: "",
        bumonCode: "",
        teamCode: ""
    } as LoginUser;

    const store = {
        loginUser: loginUser,
        alertProp: {
            show: false,
            Title: "",
            Body: "",
            ButtonLabel: "はい"
        } as AlertProp,

        showAlert(propOrBody: AlertProp | string) {
            return new Promise((resolve, reject) => {
                if (_.isString(propOrBody)) {
                    this.alertProp = Object.assign(
                        this.alertProp,
                        {Body: propOrBody, Title: "情報"},
                        {
                            show: true,
                            onClose: () => {
                                resolve();
                            }
                        }
                    );
                }
                if (propOrBody as string) {
                    this.alertProp = Object.assign(this.alertProp, propOrBody, {
                        show: true,
                        onClose: () => {
                            resolve();
                        }
                    });
                }
            });
        },

        confirmProp: {
            show: false,
            status: false,
            Title: "",
            Body: "",
            OK_ButtonLabel: "はい",
            NG_ButtonLabel: "いいえ"
        } as ConfirmProp,

        showConfirm(propOrBody: ConfirmProp | string) {
            return new Promise((resolve, reject) => {
                if (_.isString(propOrBody)) {
                    this.confirmProp = Object.assign(
                        this.confirmProp,
                        {Body: propOrBody, Title: "確認"},
                        {
                            show: true,
                            onClose: (result: boolean) => {
                                resolve(result);
                            }
                        }
                    );
                } else {
                    this.confirmProp = Object.assign(this.confirmProp, propOrBody, {
                        show: true,
                        onClose: (result: boolean) => {
                            resolve(result);
                        }
                    });
                }
            });
        },

        bushoSearchDialogProp: {
            show: false,
            adminFlg: loginUser.adminFlg,
            bushoCode: createInputStore("部署コード", ""),
            bushoName: createInputStore("部署名", "")
        } as BushoSearchDialogProp,

        showBushoSearchDialog(param?: BushoSearchDialogParam | undefined) {
            const prop = this.bushoSearchDialogProp;
            prop.bushoCode!.value = (param && param.bushoCode) || "";
            prop.bushoName!.value = (param && param.bushoName) || "";
            prop.adminFlg = (param && param.adminFlg) || false;

            return new Promise<BushoSearchDialogParam | null>((resolve, reject) => {
                prop.onClose = (result: BushoSearchDialogParam | null) => {
                    resolve(result);
                };
                prop.show = true;
            });
        },

        bumonSearchDialogProp: {
            show: false,
            bushoCode: createInputStore("部署コード", ""),
            bushoName: createInputStore("部署名", ""),
            bumonCode: createInputStore("部門コード", ""),
            bumonName: createInputStore("部門名", "")
        } as BumonSearchDialogProp,

        showBumonSearchDialog(param?: BumonSearchDialogParam | undefined) {
            const prop = this.bumonSearchDialogProp;

            prop.bushoCode!.value = (param && param.bushoCode) || "";
            prop.bushoName!.value = (param && param.bushoName) || "";
            prop.bumonCode!.value = (param && param.bumonCode) || "";
            prop.bumonName!.value = (param && param.bumonName) || "";

            return new Promise<BumonSearchDialogParam | null>((resolve, reject) => {
                prop.onClose = (secCode: BumonSearchDialogParam | null) => {
                    resolve(secCode);
                };
                prop.show = true;
            });
        },

        teamSearchDialogProp: {
            show: false,
            bushoCode: createInputStore("部署コード", ""),
            bushoName: createInputStore("部署名", ""),
            bumonCode: createInputStore("部門コード", ""),
            bumonName: createInputStore("部門名", ""),
            teamCode: createInputStore("チームコード", ""),
            teamName: createInputStore("チーム名", "")
        } as TeamSearchDialogProp,

        showTeamSearchDialog(param?: TeamSearchDialogParam | undefined) {
            const prop = this.teamSearchDialogProp;
            prop.bushoCode!.value = (param && param.bushoCode) || "";
            prop.bushoName!.value = (param && param.bushoName) || "";
            prop.bumonCode!.value = (param && param.bumonCode) || "";
            prop.bumonName!.value = (param && param.bumonName) || "";
            prop.teamCode!.value = (param && param.teamCode) || "";
            prop.teamName!.value = (param && param.teamName) || "";

            return new Promise<TeamSearchDialogParam | null>((resolve, reject) => {
                prop.onClose = (secCode: TeamSearchDialogParam | null) => {
                    resolve(secCode);
                };
                prop.show = true;
            });
        },

        userSearchDialogProp: {
            show: false,
            bushoCode: createInputStore("部署コード", ""),
            bushoName: createInputStore("部署名", ""),
            bumonCode: createInputStore("部門コード", ""),
            bumonName: createInputStore("部門名", ""),
            teamCode: createInputStore("チームコード", ""),
            teamName: createInputStore("チーム名", ""),
            userId: createInputStore("ユーザーID", ""),
            userName: createInputStore("ユーザー名", "")
        } as UserSearchDialogProp,

        showUserSearchDialog(param?: UserSearchDialogParam | undefined) {
            const prop = this.userSearchDialogProp;
            prop.bushoCode!.value = (param && param.bushoCode) || "";
            prop.bushoName!.value = (param && param.bushoName) || "";
            prop.bumonCode!.value = (param && param.bumonCode) || "";
            prop.bumonName!.value = (param && param.bumonName) || "";
            prop.teamCode!.value = (param && param.teamCode) || "";
            prop.teamName!.value = (param && param.teamName) || "";
            prop.userId!.value = (param && param.userId) || "";
            prop.userName!.value = (param && param.userName) || "";

            return new Promise<UserSearchDialogParam | null>((resolve, reject) => {
                prop.onClose = (secCode: UserSearchDialogParam | null) => {
                    resolve(secCode);
                };
                prop.show = true;
            });
        },

        torihikisakiSearchDialogProp: {
            show: false,
            kbn: "MH",
            torihikisakiCode: createInputStore("取引先コード", ""),
            torihikisakiName: createInputStore("取引先名", ""),
            torihikisakiAbbrName: createInputStore("取引先名", "")
        } as TorihikisakiSearchDialogProp,

        showTorihikisakiSearchDialog(
            param?: TorihikisakiSearchDialogParam | undefined
        ) {
            const prop = this.torihikisakiSearchDialogProp;
            prop.kbn = (param && param.kbn) || "MH";
            prop.torihikisakiCode!.value = (param && param.torihikisakiCode) || "";
            prop.torihikisakiName!.value = (param && param.torihikisakiName) || "";
            prop.torihikisakiAbbrName!.value = (param && param.torihikisakiAbbrName) || "";

            return new Promise<TorihikisakiSearchDialogParam | null>(
                (resolve, reject) => {
                    prop.onClose = (result: TorihikisakiSearchDialogParam | null) => {
                        resolve(result);
                    };
                    prop.show = true;
                }
            );
        },


        buyerSearchDialogProp: {
            show: false,
            kbn: "MH",
            buyerCd: createInputStore("取引先コード", ""),
            buyerName: createInputStore("取引先名", ""),
            buyerAbbrName: createInputStore("取引先名", "")
        } as BuyerSearchDialogProp,

        showBuyerSearchDialog(
            param?: BuyerSearchDialogParam | undefined
        ) {
            const prop = this.buyerSearchDialogProp;
            prop.kbn = (param && param.kbn) || "MH";
            prop.buyerCd!.value = (param && param.buyerCd) || "";
            prop.buyerName!.value = (param && param.buyerName) || "";
            prop.buyerAbbrName!.value = (param && param.buyerAbbrName) || "";

            return new Promise<BuyerSearchDialogParam | null>(
                (resolve) => {
                    prop.onClose = (result: BuyerSearchDialogParam | null) => {
                        resolve(result);
                    };
                    prop.show = true;
                }
            );
        },

        branchSearchDialogProp: {
            show: false,
            buyerCode: createInputStore("受注先コード", ""),
            branchName: createInputStore("支店名", ""),
            labelName: createInputStore("部署名", "")
        } as BranchSearchDialogProp,

        showBranchSearchDialog(param?: BranchSearchDialogParam | undefined) {
            const prop = this.branchSearchDialogProp;
            prop.buyerCode!.value = (param && param.buyerCode) || "";
            prop.branchName!.value = (param && param.branchName) || "";
            prop.labelName!.value = (param && param.labelName) || "";

            return new Promise<BranchSearchDialogParam | null>((resolve, reject) => {
                prop.onClose = (result: BranchSearchDialogParam | null) => {
                    resolve(result);
                };
                prop.show = true;
            });
        },

        orderItemSearchDialogProp: {
            show: false
        } as OrderItemSearchDialogProp,

        showOrderItemSearchDialog(param?: OrderItemSearchDialogParam | undefined) {
            const prop = this.orderItemSearchDialogProp;
            return new Promise<OrderItemSearchDialogParam | null>(
                (resolve, reject) => {
                    prop.onClose = (result: OrderItemSearchDialogParam | null) => {
                        resolve(result);
                    };
                    prop.show = true;
                }
            );
        },

        async showInvalidAlert(res: ErrorResData, store: any) {
            let messages = new Set<string>();
            let propNames = new Set<string>();
            let tmpStore: any = store;
            let cnt = 0;
            let alertMessage = new Array<ReactNode>();

            alertMessage.push(
                <h5 key={cnt}>{res.errorInfo!.message}</h5>
            );

            var subStrAfterChars = (function() {
                return function(str: any, chr:any, pos:any){
                    str = str.substr(str.indexOf(chr)+1);
                    return str.substr(0, str.indexOf(pos));
                }
            })();

            let property = '';
            for (let dtl of res.errorInfo!.details!) {
                let labels: any = [];
                cnt++;
                let message = dtl.message;
                let property_temp = subStrAfterChars(String(dtl.propertyNames), '[',']');

                if (property_temp){
                    for (let propName of dtl.propertyNames) {
                        propNames.add(propName.substr(propName.indexOf(']') + 2));
                        labels.push(propName.substr(propName.indexOf(']') + 2));
                    }
                } else {
                    for (let propName of dtl.propertyNames) {
                        propNames.add(propName);
                        labels.push(propName);
                    }
                }

                for (let key in tmpStore) {
                    if (isInputStore(tmpStore[key])) {
                        if (labels.indexOf(key) >= 0) {
                            message = message.replace(
                                new RegExp("\\[LABEL\\]", "g"),
                                tmpStore[key].label
                            );
                        }
                    }
                }

                alertMessage.push(
                    <div key={cnt} className={'mes_item'}>
                        <label key={cnt + 1}>{property !== property_temp ? property_temp + ' :': ''}</label>
                        <div key={cnt + 2}>{message}</div>
                    </div>
                );
                property = property_temp;
            }

            propNames.forEach(x => {
                let tmp: any = tmpStore;
                tmpStore[x] && (tmp[x].isInvalid = true);
            });

            await this!.showAlert({
                Title: "警告",
                Body: alertMessage
            });
        }
    };
    return store;
};

export type BaseStore = ReturnType<typeof createStore>;
