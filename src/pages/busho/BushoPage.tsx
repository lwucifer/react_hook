import React from "react";
import {useObserver, useLocalStore} from "mobx-react-lite";
import BushoListPage from "./BushoListPage";
import BushoInputPage from "./BushoInputPage";
import MainLayout from "../../layouts/MainLayout";

type BushoPageProp = {};

export type BushoPageStore = {
    mode: "list" | "create" | "update";
    secId: number;
    setMode: (mode: "list" | "create" | "update") => void;
    idSelected: (id: number) => void;
};

const BushoPage: React.FC<BushoPageProp> = prop => {
    const store = useLocalStore(
        () =>
            ({
                mode: "list",
                secId: 0,
                setMode(mode: "list" | "create" | "update") {
                    this.mode = mode;
                },
                idSelected(id) {
                    this.secId = id;
                    this.mode = "update";
                }
            } as BushoPageStore)
    );

    return useObserver(() => (
        <MainLayout
            systemName="業務システム"
            tilte="部署マスタ"

        >
            {store.mode === "list" && <BushoListPage parentStore={store}/>}
            {(store.mode === "create" || store.mode === "update") && (
                <BushoInputPage parentStore={store}/>
            )}
        </MainLayout>
    ));
};

export default BushoPage;
