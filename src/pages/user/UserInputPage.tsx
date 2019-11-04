import React, {useEffect} from "react";
import {UserPageStore} from "./UserPage";
import Row from "../../components/Row";
import Label from "../../components/Label";
import Text from "../../components/Text";
import {SelectBool} from "../../components/Select";
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

type UserInputPageProp = {
    parentStore: UserPageStore;
};

type Busho = {
    id: number;
    bushoCode: string;
    bushoName: string;
    adminFlg: boolean;
};
type Bumon = {
    id: number;
    bumonCode: string;
    bumonName: string;
};
type Team = {
    id: number;
    teamCode: string;
    teamName: string;
};

type User = {
    id: number;
    userId: string;
    userName: string;
    bumonCode: string;
    bumonName: string;
    bushoCode: string;
    bushoName: string;
    adminFlg: boolean;
    teamCode: string;
    teamName: string;
    version: number;
};

const UserInputPage: React.FC<UserInputPageProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = useLocalStore(() => ({
        id: 0,
        userId: createInputStore<string>("ユーザーID"),
        userName: createInputStore<string>("ユーザー名"),
        bumonCode: createInputStore<string>("部門コード"),
        bumonName: createInputStore<string>("部門名"),
        bushoCode: createInputStore<string>("部署コード"),
        bushoName: createInputStore<string>("部署名"),
        adminFlg: createInputStore<boolean>("システム管理者権限"),
        teamCode: createInputStore<string>("チームコード"),
        teamName: createInputStore<string>("チーム名"),
        version: 0,

        async validate(sendData: { user: User }) {
            const validateRes = await postRequest<{ token: string }>(
                "user/validate",
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
                user: Object.assign(createInputValueObject(this))
            };
            if (!(await this.validate(sendData))) {
                return;
            }
            if (!(await grobalStore!.showConfirm("部署情報を登録します。よろしいですか？"))) {
                return;
            }
            const createRes = await postRequest<{ token: string }>(
                "user/create",
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
                user: Object.assign(
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
                "user/update",
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
                "user/delete",
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
            store.userId.value = "";
            store.userName.value = "";
            store.bumonCode.value = "";
            store.bumonName.value = "";
            store.bushoCode.value = "";
            store.bushoName.value = "";
            store.adminFlg.value = false;
            store.version = 0;
        }
        if (prop.parentStore.mode === "update") {
            (async () => {
                var res = await postRequest<{ user: User; }>(
                    "user/getOne",
                    {id: prop.parentStore.secId}
                );
                if (res instanceof ErrorResData) {
                    grobalStore!.showInvalidAlert(res, store);
                } else {
                    setData2Store(store, res.user);
                }
            })();
        }
    }, [grobalStore,prop.parentStore,store]);

    return useObserver(() => (
        <div>
            <div className="form">
                <Row>
                    <Label width={150}>ユーザーID:</Label>
                    <Text
                        width={300}
                        maxLength={50}
                        imeOff
                        {...createInputProp(store.userId)}
                        readOnly={prop.parentStore.mode === "update"}
                    />
                </Row>
                <Row>
                    <Label width={150}>ユーザー名:</Label>
                    <Text
                        width={300}
                        maxLength={60}
                        {...createInputProp(store.userName)}
                    />
                </Row>
                <Row>
                    <Label width={150}>部署：</Label>
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
                                  store.adminFlg!.value = busho.adminFlg;
                              }
                          }}/>
                    <Button
                        className="fa fa-search mr-5px"
                        onClick={async () => {
                            const ret = await grobalStore!.showBushoSearchDialog();
                            if (ret) {
                                store.bushoCode!.value = ret.bushoCode;
                                store.bushoName!.value = ret.bushoName;
                                store.adminFlg!.value = ret.adminFlg;
                                store.bumonCode!.value = "";
                                store.bumonName!.value = "";
                                store.teamCode!.value = "";
                                store.teamName!.value = "";
                            }
                        }}
                    />
                    <Text
                        width={200}
                        imeOff
                        {...createInputProp(store.bushoName!)}
                        readOnly={true}
                    />
                    <Label width={150}>システム管理者権限:</Label>
                    <SelectBool
                        width={200}
                        items={[
                            {label: "〇", value: "true"},
                            {label: "", value: "false"}
                        ]}
                        {...createInputProp(store.adminFlg!)}
                    />
                </Row>
                <Row>
                    <Label width={150}>部門：</Label>
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
                                store.teamCode!.value = "";
                                store.teamName!.value = "";
                            }
                        }}
                    />
                    <Text
                        width={200}
                        imeOff
                        {...createInputProp(store.bumonName!)}
                        readOnly={true}
                    />
                </Row>
                <Row>
                    <Label width={150}>チーム：</Label>
                    <Text
                        width={100}
                        maxLength={4}
                        imeOff
                        {...createInputProp(store.teamCode)}
                        onChange={async (e) => {
                            store.teamName!.value = "";
                            store.teamCode!.value = e;
                            var res = await postRequest<{ team: Team; }>(
                                "team/getOneTeamCode",
                                {teamCode: store.teamCode!.value}
                            );
                            if ( !(res instanceof ErrorResData) ) {
                                let team = res.team;
                                store.teamName!.value = team.teamName;
                                store.teamCode!.value = team.teamCode;
                            }
                        }}/>
                    <Button
                        className="fa fa-search mr-5px"
                        onClick={async () => {
                            const ret = await grobalStore!.showTeamSearchDialog({
                                bushoCode: (store && store.bushoCode && store.bushoCode.value) || "",
                                bushoName: (store && store.bushoName && store.bushoName.value) || "",
                                bumonCode: (store && store.bumonCode && store.bumonCode.value) || "",
                                bumonName: (store && store.bumonName && store.bumonName.value) || ""
                            });
                            if (ret) {
                                store.bushoCode!.value = ret.bushoCode;
                                store.bushoName!.value = ret.bushoName;
                                store.bumonCode!.value = ret.bumonCode;
                                store.bumonName!.value = ret.bumonName;
                                store.teamCode!.value = ret.teamCode;
                                store.teamName!.value = ret.teamName;
                            }
                        }}
                    />

                    <Text
                        width={200}
                        imeOff
                        {...createInputProp(store.teamName!)}
                        readOnly={true}
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
export default UserInputPage;
