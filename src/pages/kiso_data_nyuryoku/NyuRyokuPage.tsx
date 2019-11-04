import React from "react";
import {useObserver, useLocalStore} from "mobx-react-lite";
import NyuRyokuList from "./NyuRyokuList";
import NyuRyokuInput from "./NyuRyokuInput";
import MainLayout from "../../layouts/MainLayout";

type NyuRyokuPageProp = {};

export type NyuRyokuPageStore = {
    mode: "list" | "create" | "update";
    secId: number;
    param: any;
    store: any;
    updated: boolean;
    setMode: (mode: "list" | "create" | "update", updated: boolean) => void;
    idSelected: (id: number, param: any, store: any) => void;
};


const NyuRyokuPage: React.FC<NyuRyokuPageProp> = prop => {
    const store = useLocalStore(() => ({
            mode: "list",
            secId: 0,
            setMode(mode: "list" | "create" | "update", updated: boolean) {
                this.mode = mode;
                this.updated = updated;
            },
            idSelected(id, param, store) {
                this.secId = id;
                this.mode = "update";
                this.param = param;
                this.store = store;
            }
        } as NyuRyokuPageStore)
    );

    return useObserver(() => (
        <MainLayout
            systemName="業務システム"
            tilte="基礎データ更新入力"
        >
            {store.mode === "list" && <NyuRyokuList parentStore={store}/>}
            {(store.mode === "create" || store.mode === "update") && (
                <NyuRyokuInput parentStore={store}/>
            )}
        </MainLayout>
    ));
};

export default NyuRyokuPage;
