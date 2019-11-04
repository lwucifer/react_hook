import React, {useEffect} from "react";
import {BushoPageStore} from "./BushoPage";
import Row from "../../components/Row";
import Label from "../../components/Label";
import Text from "../../components/Text";
import {SelectBool} from "../../components/Select";
import Button from "../../components/Button";
import {useObserver, useLocalStore} from "mobx-react-lite";
import {storeContext} from "../../Context";
import {
    clearInvalidProp,
    createInputStore,
    createInputProp,
    createInputValueObject,
    postRequest,
    ErrorResData, setData2Store
} from "../../utils/AppUtils";

type BushoInputPageProp = {
    parentStore: BushoPageStore;
};

type Busho = {
    id: number;
    bushoCode: string;
    bushoName: string;
    adminFlg: boolean;
    version: number;
};

const BushoInputPage: React.FC<BushoInputPageProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = useLocalStore(() => ({
        id: 0,
        bushoCode: createInputStore<string>("部署コード"),
        bushoName: createInputStore<string>("部署名"),
        adminFlg: createInputStore<boolean>("システム管理者権限"),
        version: 0,

        async validate(sendData: { busho: Busho }) {
            const validateRes = await postRequest<{ token: string }>(
                "busho/validate",
                sendData
            );
            if (validateRes instanceof ErrorResData) {
                await grobalStore!.showInvalidAlert(validateRes, this);
                return false;
            }
            return true;
        },

        async create() {
            clearInvalidProp(this);
            let sendData = {
                busho: Object.assign(createInputValueObject(this))
            };

            if (!(await this.validate(sendData))) {
                return;
            }
            if (
                !(await grobalStore!.showConfirm(
                    "部署情報を登録します。よろしいですか？"
                ))
            ) {
                return;
            }
            const createRes = await postRequest<{ token: string }>(
                "busho/create",
                sendData
            );
            if (createRes instanceof ErrorResData) {
                await grobalStore!.showInvalidAlert(createRes, this);
                return;
            }
            await grobalStore!.showAlert("部署情報を登録しました。");
            prop.parentStore.setMode("list");
        },

        async update() {
            clearInvalidProp(this);
            let sendData = {
                busho: Object.assign(
                    {id: store.id, version: store.version},
                    createInputValueObject(this)
                )
            };

            if (!(await this.validate(sendData))) {
                return;
            }

            if (
                !(await grobalStore!.showConfirm(
                    "部署情報を更新します。よろしいですか？"
                ))
            ) {
                return;
            }

            const updateRes = await postRequest<{ token: string }>(
                "busho/update",
                sendData
            );
            if (updateRes instanceof ErrorResData) {
                await grobalStore!.showInvalidAlert(updateRes, this);
                return;
            }
            await grobalStore!.showAlert("部署情報を更新しました。");
            prop.parentStore.setMode("list");
        },

        async delete() {
            clearInvalidProp(this);
            let sendData = {id: store.id, version: store.version};

            if (
                !(await grobalStore!.showConfirm(
                    "部署情報を削除します。よろしいですか？"
                ))
            ) {
                return;
            }

            const deleteRes = await postRequest<{ token: string }>(
                "busho/delete",
                sendData
            );
            if (deleteRes instanceof ErrorResData) {
                await grobalStore!.showInvalidAlert(deleteRes, this);
                return;
            }
            await grobalStore!.showAlert("部署情報を削除しました。");
            prop.parentStore.setMode("list");
        },

        cancel() {
            prop.parentStore.setMode("list");
        }
    }));

    useEffect(() => {
        clearInvalidProp(store);
        if (prop.parentStore.mode === "create") {
            store.id = 0;
            store.bushoCode.value = "";
            store.bushoName.value = "";
            store.adminFlg.value = false;
            store.version = 0;
        }
        if (prop.parentStore.mode === "update") {
            (async () => {
                var res = await postRequest<{ busho: Busho; }>(
                    "busho/getOne",
                    {id: prop.parentStore.secId}
                );
                if (res instanceof ErrorResData) {
                    grobalStore!.showInvalidAlert(res, store);
                } else {
                   setData2Store(store, res.busho);
                }
            })();
        }
    }, [grobalStore,prop.parentStore,store]);

    return useObserver(() => (
        <div>
            <div className="form">
                <Row>
                    <Label width={150}>部署コード</Label>
                    <Text
                        width={100}
                        maxLength={3}
                        imeOff
                        {...createInputProp(store.bushoCode)}
                        readOnly={prop.parentStore.mode === "update"}
                    />
                </Row>
                <Row>
                    <Label width={150}>部署名</Label>
                    <Text
                        width={300}
                        maxLength={50}
                        {...createInputProp(store.bushoName)}
                    />
                </Row>
                <Row>
                    <Label width={150}>システム管理者権限</Label>
                    <SelectBool
                        width={100}
                        items={[
                            {label: "", value: "false"},
                            {label: "〇", value: "true"}
                        ]}
                        {...createInputProp(store.adminFlg)}
                    />
                </Row>
            </div>

            <Row>
                {prop.parentStore.mode === "update" && (
                    <Button onClick={store.update} className="ml-auto">更新</Button>
                )}
                {prop.parentStore.mode === "create" && (
                    <Button onClick={store.create} className="ml-auto">登録</Button>
                )}
                {prop.parentStore.mode === "create" && (
                    <Button variant="dark" onClick={store.delete} disabled={true}>削除</Button>
                )}
                {prop.parentStore.mode === "update" && (
                    <Button variant="dark" onClick={store.delete}>削除</Button>
                )}
                <Button variant="secondary" onClick={store.cancel}>キャンセル</Button>
            </Row>
        </div>
    ));
};
export default BushoInputPage;
