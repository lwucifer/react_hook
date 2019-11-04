import React, {Suspense} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import "./bootstrap.min.css";
import "./css/jquery-ui.min.css";
import "./css/jquery-ui.structure.min.css";
import "./css/jquery-ui.theme.min.css";
import "./css/ui.jqgrid.css";
import "./App.css";
import StoreProvider from "./Context";

import LoginPage from "./pages/LoginPage";
import MainMenuPage from "./pages/MainMenuPage";
import BushoPage from "./pages/busho/BushoPage";
import BumonPage from "./pages/bumon/BumonPage";
import TeamPage from "./pages/team/TeamPage";
import UserPage from "./pages/user/UserPage";
import TorihikisakiPage from "./pages/torihikisaki/TorihikisakiPage";
import TantoList from "./pages/tanto/TantoList";
import NyuRyokuPage from "./pages/kiso_data_nyuryoku/NyuRyokuPage";
import MhIgaiJuchu from "./pages/mhigaijuchu/MhIgaiJuchu";
import Nyuryoku from "./pages/uriage_seikyu_nyuryoku/Nyuryoku";
import Kakunin from "./pages/uriage_seikyu_kakunin/Kakunin";
import NyukinPage from "./pages/nyukin/NyukinPage";
import Bunpai from "./pages/shanai/Bunpai";
import DataOutput from "./pages/output/DataOutput";

import InputSamplePage from "./pages/InputSamplePage";


import Auth from "./components/Auth";

import AlertModal from "./components/AlertModal";
import ConfirmModal from "./components/ConfirmModal";
import BushoSearchDialog from "./dialogs/BushoSearchDialog";
import BumonSearchDialog from "./dialogs/BumonSearchDialog";
import TeamSearchDialog from "./dialogs/TeamSearchDialog";
import UserSearchDialog from "./dialogs/UserSearchDialog";
import TorihikisakiSearchDialog from "./dialogs/TorihikisakiSearchDialog";
import BranchSearchDialog from "./dialogs/BranchSearchDialog";
import OrderItemSearchDialog from "./dialogs/OrderItemSearchDialog";
import BuyerSearchDialog from "./dialogs/BuyerSearchDialog";
import { getEnvConfig, env } from "./env/EnvConfig";

console.log("env", env);
const App: React.FC = () => {
    const contextRoot = getEnvConfig().contextRoot;
    return (
        <StoreProvider>
            <Router basename={contextRoot}>
                <Switch>
                    <Route path="/" component={LoginPage} exact/>
                        <Auth>
                            <Switch>
                                <Route path="/mainmenu" component={MainMenuPage} exact/>
                                <Route path="/kiso/nyuryoku" component={NyuRyokuPage} exact/>
                                <Route path="/tanto/list" component={TantoList} exact/>
                                <Route path="/mhigaijuchu" component={MhIgaiJuchu} exact/>
                                <Route path="/uriage/nyuryoku" component={Nyuryoku} exact/>
                                <Route path="/uriage/kakunin" component={Kakunin} exact/>
                                <Route path="/nyukin" component={NyukinPage} exact/>
                                <Route path="/shanai/bunpai" component={Bunpai} exact/>
                                <Route path="/data/output" component={DataOutput} exact/>
                                <Route path="/busho" component={BushoPage} exact/>
                                <Route path="/bumon" component={BumonPage} exact/>
                                <Route path="/team" component={TeamPage} exact/>
                                <Route path="/user" component={UserPage} exact/>
                                <Route path="/torihikisaki" component={TorihikisakiPage} exact/>
                                <Route path="/sampleInput" component={InputSamplePage} exact/>
                            </Switch>
                        </Auth>
                        <Route render = {()=> "ページがありません"} />
                </Switch>
            </Router>
            <a id="downloadField" />
            <AlertModal/>
            <ConfirmModal/>
            <BushoSearchDialog/>
            <BumonSearchDialog/>
            <TeamSearchDialog/>
            <UserSearchDialog/>
            <TorihikisakiSearchDialog/>
            <BranchSearchDialog/>
            <OrderItemSearchDialog/>
            <BuyerSearchDialog/>
        </StoreProvider>
    );
};

export default App;
