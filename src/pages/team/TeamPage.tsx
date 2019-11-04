import React from "react";
import {useObserver, useLocalStore} from "mobx-react-lite";
import TeamListPage from "./TeamListPage";
import TeamInputPage from "./TeamInputPage";
import MainLayout from "../../layouts/MainLayout";

type TeamPageProp = {};

export type TeamPageStore = {
    mode: "list" | "create" | "update";
    secId: number;
    setMode: (mode: "list" | "create" | "update") => void;
    idSelected: (id: number) => void;
};

const TeamPage: React.FC<TeamPageProp> = prop => {
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
            } as TeamPageStore)
    );

    return useObserver(() => (
        <MainLayout
            systemName="業務システム"
            tilte="チームマスタ"

        >
            {store.mode === "list" && <TeamListPage parentStore={store}/>}
            {(store.mode === "create" || store.mode === "update") && (
                <TeamInputPage parentStore={store}/>
            )}
        </MainLayout>
    ));
};

export default TeamPage;
