import React from "react";
import {useObserver, useLocalStore} from "mobx-react-lite";
import UserListPage from "./UserListPage";
import UserInputPage from "./UserInputPage";
import MainLayout from "../../layouts/MainLayout";

type UserPageProp = {};

export type UserPageStore = {
    mode: "list" | "create" | "update";
    secId: number;
    setMode: (mode: "list" | "create" | "update") => void;
    idSelected: (id: number) => void;
};

const UserPage: React.FC<UserPageProp> = prop => {
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
    } as UserPageStore));

    return useObserver(() => (
        <MainLayout
            systemName="業務システム"
            tilte="ユーザーマスタ"

        >
            {store.mode === "list" && <UserListPage parentStore={store}/>}
            {(store.mode === "create" || store.mode === "update") && (
                <UserInputPage parentStore={store}/>
            )}
        </MainLayout>
    ));
};

export default UserPage;
