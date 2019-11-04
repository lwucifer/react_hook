import React, {useEffect} from "react";
import {TeamPageStore} from "./TeamPage";
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

type TeamInputPageProp = {
    parentStore: TeamPageStore;
};

type Team = {
    id: number;
    teamCode: string;
    teamName: string;
    bumonCode: string;
    bumonName: string;
    bushoCode: string;
    bushoName: string;
    version: number;
};

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

const TeamInputPage: React.FC<TeamInputPageProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = useLocalStore(() => ({
        id: 0,
        teamCode: createInputStore<string>("チームコード"),
        teamName: createInputStore<string>("チーム名"),
        bumonCode: createInputStore<string>("部門コード"),
        bumonName: createInputStore<string>("部門名"),
        bushoCode: createInputStore<string>("部署コード"),
        bushoName: createInputStore<string>("部署名"),
        version: 0,

        async validate(sendData: { team: Team }) {
            const validateRes = await postRequest<{ token: string }>(
                "team/validate",
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
                team: Object.assign(createInputValueObject(this))
            };

            if (!(await this.validate(sendData))) {
                return;
            }
            if (!(await grobalStore!.showConfirm("部署情報を登録します。よろしいですか？"))) {
                return;
            }
            const createRes = await postRequest<{ token: string }>(
                "team/create",
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
                team: Object.assign(
                    {id: store.id, version: store.version},
                    createInputValueObject(this)
                )
            };

            if (!(await this.validate(sendData))) {
                return;
            }

            if (!(await grobalStore!.showConfirm("部署情報を更新します。よろしいですか？"))) {
                return;
            }

            const updateRes = await postRequest<{ token: string }>(
                "team/update",
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

            if (!(await grobalStore!.showConfirm("部署情報を削除します。よろしいですか？"))) {
                return;
            }

            const deleteRes = await postRequest<{ token: string }>(
                "team/delete",
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
            store.teamCode.value = "";
            store.teamName.value = "";
            store.bumonCode.value = "";
            store.bumonName.value = "";
            store.bushoCode.value = "";
            store.bushoName.value = "";
            store.version = 0;
        }
        if (prop.parentStore.mode === "update") {
            (async () => {
                var res = await postRequest<{
                    team: Team;
                }>("team/getOne", {
                    id: prop.parentStore.secId
                });
                if (res instanceof ErrorResData) {
                    grobalStore!.showInvalidAlert(res, store);
                } else {
                    setData2Store(store, res.team);
                }
            })();
        }
    }, [grobalStore,prop.parentStore,store]);

    return useObserver(() => (
        <div>
            <div className="form">
                <Row>
                    <Label width={100}>部署：</Label>
                    {prop.parentStore.mode === "update" && (
                        <Text
                            width={100}
                            imeOff
                            {...createInputProp(store.bushoCode!)}
                            readOnly={true}
                        />
                    )}
                    {prop.parentStore.mode === "create" && (
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
                    )}
                    {prop.parentStore.mode === "create" && (
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
                    )}
                    {prop.parentStore.mode === "update" && (
                        <Button className="fa fa-search mr-5px" disabled={true}/>)}
                    <Text
                        width={200}
                        imeOff
                        {...createInputProp(store.bushoName!)}
                        readOnly={true}
                    />
                </Row>
                <Row>
                    <Label width={100}>部門：</Label>
                    {prop.parentStore.mode === "update" && (
                        <Text
                            width={100}
                            imeOff
                            {...createInputProp(store.bumonCode!)}
                            readOnly={true}
                        />
                    )}
                    {prop.parentStore.mode === "create" && (
                        <Text width={100} {...createInputProp(store.bumonCode!)}
                              maxLength={4}
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
                              }}/>
                    )}
                    {prop.parentStore.mode === "create" && (
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
                    )}
                    {prop.parentStore.mode === "update" && (
                        <Button className="fa fa-search mr-5px" disabled={true}/>)}
                    <Text
                        width={200}
                        imeOff
                        {...createInputProp(store.bumonName!)}
                        readOnly={true}
                    />
                </Row>
                <Row>
                    <Label width={100}>チームコード:</Label>
                    <Text
                        width={200}
                        maxLength={4}
                        imeOff
                        {...createInputProp(store.teamCode)}
                        readOnly={prop.parentStore.mode === "update"}
                    />
                </Row>
                <Row>
                    <Label width={100}>チーム名:</Label>
                    <Text
                        width={200}
                        maxLength={50}
                        {...createInputProp(store.teamName)}
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
export default TeamInputPage;
