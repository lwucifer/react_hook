import React from "react";
import {useObserver, useLocalStore} from "mobx-react-lite";
import NyukinListPage from "./NyukinList";
import NyukinInputPage from "./NyukinInput";
import MainLayout from "../../layouts/MainLayout";

type NyukinPageProp = {};

export type NyukinPageStore = {
    mode: "list" | "create" | "update";
    param: any;
    store: any;
    setMode: (mode: "list" | "create" | "update") => void;
    idSelected: (param: any, store: any) => void;
};

const NyukinPage: React.FC<NyukinPageProp> = prop => {
    const store = useLocalStore(
        () =>
            ({
                mode: "list",
                param: [],
                setMode(mode: "list" | "create" | "update") {
                    this.mode = mode;
                },
                idSelected(param, store) {
                    this.param = param;
                    this.mode = "update";
                    this.store = store;
                }
            } as NyukinPageStore)
    );

    return useObserver(() => (
        <MainLayout
            systemName="業務システム"
            tilte="MH入金一括取込"
        >
            {store.mode === "list" && <NyukinListPage parentStore={store}/>}
            {(store.mode === "create" || store.mode === "update") && (
                <NyukinInputPage parentStore={store}/>
            )}
        </MainLayout>
    ));
};

export default NyukinPage;
