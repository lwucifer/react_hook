import React from "react";
import {useObserver, useLocalStore} from "mobx-react-lite";
import BumonListPage from "./BumonListPage";
import BumonInputPage from "./BumonInputPage";
import MainLayout from "../../layouts/MainLayout";

type BumonPageProp = {};

export type BumonPageStore = {
    mode: "list" | "create" | "update";
    secId: number;
    setMode: (mode: "list" | "create" | "update") => void;
    idSelected: (id: number) => void;
};

const BumonPage: React.FC<BumonPageProp> = prop => {
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
            } as BumonPageStore)
    );

    return useObserver(() => (
        <MainLayout
            systemName="業務システム"
            tilte="部門マスタ"

        >
            {store.mode === "list" && <BumonListPage parentStore={store}/>}
            {(store.mode === "create" || store.mode === "update") && (
                <BumonInputPage parentStore={store}/>
            )}
        </MainLayout>
    ));
};

export default BumonPage;
