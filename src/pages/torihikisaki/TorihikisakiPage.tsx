import React from "react";
import {useObserver, useLocalStore} from "mobx-react-lite";
import TorihikisakiListPage from "./TorihikisakiListPage";
import TorihikisakiInputPage from "./TorihikisakiInputPage";
import MainLayout from "../../layouts/MainLayout";

type TorihikisakiPageProp = {};

export type TorihikisakiPageStore = {
    mode: "list" | "create" | "update";
    secId: number;
    setMode: (mode: "list" | "create" | "update") => void;
    idSelected: (id: number) => void;
};

const TorihikisakiPage: React.FC<TorihikisakiPageProp> = prop => {
    const store = useLocalStore(() => ({
        mode: "list",
        secId: 0,
        setMode(mode: "list" | "create" | "update") {
            this.mode = mode;
        },
        idSelected(id) {
            this.secId = id;
            this.mode = "update";
        }
    } as TorihikisakiPageStore));

    return useObserver(() => (
        <MainLayout
            systemName="業務システム"
            tilte="取引先マスタ"

        >
            {store.mode === "list" && <TorihikisakiListPage parentStore={store}/>}
            {(store.mode === "create" || store.mode === "update") && (
                <TorihikisakiInputPage parentStore={store}/>
            )}
        </MainLayout>
    ));
};

export default TorihikisakiPage;
