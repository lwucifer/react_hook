import React, {useEffect} from "react";
import {TorihikisakiPageStore} from "./TorihikisakiPage";
import Row from "../../components/Row";
import Label from "../../components/Label";
import Text from "../../components/Text";
import Button from "../../components/Button";
import {useObserver, useLocalStore} from "mobx-react-lite";
import {
    clearInvalidProp,
    createInputStore,
    createInputProp,
    createInputValueObject,
    postRequest,
    ErrorResData, setData2Store
} from "../../utils/AppUtils";
import {storeContext} from "../../Context";

type TorihikisakiInputPageProp = {
    parentStore: TorihikisakiPageStore;
};

type Torihikisaki = {
    id: number;
    torihikisakiCode: string;
    torihikisakiName: string;
    torihikisakiAbbrName: string;
    telNo: string;
    faxNo: string;
    zipCode: string;
    address1: string;
    address2: string;
    address3: string;
    version: number;
};

const TorihikisakiInputPage: React.FC<TorihikisakiInputPageProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = useLocalStore(() => ({
        id: 0,
        torihikisakiCode: createInputStore<string>("取引先コード"),
        torihikisakiName: createInputStore<string>("取引先名（正式）"),
        torihikisakiAbbrName: createInputStore<string>("取引先名（略名）"),
        telNo: createInputStore<string>("電話番号"),
        faxNo: createInputStore<string>("FAX番号"),
        zipCode: createInputStore<string>("郵便番号"),
        address1: createInputStore<string>("住所１"),
        address2: createInputStore<string>("住所２"),
        address3: createInputStore<string>("住所３"),
        version: 0,
    async validate(sendData: { torihikisaki: Torihikisaki }) {
            const validateRes = await postRequest<{ token: string }>(
                "torihikisaki/validate",
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
                torihikisaki: Object.assign(createInputValueObject(this))
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
                "torihikisaki/create",
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
                torihikisaki: Object.assign(
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
                "torihikisaki/update",
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
                "torihikisaki/delete",
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
            store.torihikisakiCode.value = "";
            store.torihikisakiName.value = "";
            store.torihikisakiAbbrName.value = "";
            store.telNo.value = "";
            store.faxNo.value = "";
            store.zipCode.value = "";
            store.address1.value = "";
            store.address2.value = "";
            store.address3.value = "";
            store.version = 0;
        }
        if (prop.parentStore.mode === "update") {
            (async () => {
                var res = await postRequest<{ torihikisaki: Torihikisaki; }>(
                    "torihikisaki/getOne",
                    {id: prop.parentStore.secId}
                );
                if (res instanceof ErrorResData) {
                    grobalStore!.showInvalidAlert(res, store);
                } else {
                    setData2Store(store, res.torihikisaki);
                }
            })();
        }
    }, [grobalStore,prop.parentStore,store]);

    return useObserver(() => (
        <div>
            <div className="form">
                <Row>
                    <Label width={150}>	取引先コード:</Label>
                    <Text
                        width={100}
                        maxLength={8}
                        imeOff
                        {...createInputProp(store.torihikisakiCode)}
                        readOnly={prop.parentStore.mode === "update"}
                    />
                </Row>
                <Row>
                    <Label width={150}>取引先名（正式）:</Label>
                    <Text
                        width={300}
                        maxLength={60}
                        {...createInputProp(store.torihikisakiName)}
                    />
                </Row>
                <Row>
                    <Label width={150}>取引先名（略名）:</Label>
                    <Text
                        width={300}
                        maxLength={30}
                        {...createInputProp(store.torihikisakiAbbrName)}
                    />
                </Row>
                <Row>
                    <Label width={150}>電話番号:</Label>
                    <Text
                        width={200}
                        maxLength={20}
                        {...createInputProp(store.telNo)}
                    />
                </Row>
                <Row>
                    <Label width={150}>FAX番号:</Label>
                    <Text
                        width={200}
                        maxLength={20}
                        {...createInputProp(store.faxNo)}
                    />
                </Row>
                <Row>
                    <Label width={150}>郵便番号:</Label>
                    <Text
                        width={200}
                        maxLength={8}
                        {...createInputProp(store.zipCode)}
                    />
                </Row>
                <Row>
                    <Label width={150}>住所１:</Label>
                    <Text
                        maxLength={60}
                        width={300}
                        {...createInputProp(store.address1)}
                    />
                </Row>
                <Row>
                    <Label width={150}>住所２:</Label>
                    <Text
                        maxLength={60}
                        width={300}
                        {...createInputProp(store.address2)}
                    />
                </Row>
                <Row>
                    <Label width={150}>住所３:</Label>
                    <Text
                        maxLength={60}
                        width={300}
                        {...createInputProp(store.address3)}
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
export default TorihikisakiInputPage;
