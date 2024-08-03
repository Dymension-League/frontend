import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MintShips from "./pages/MintShip/MintShips";
import MintPage from "./pages/MintShip/MintPage";
import React, {useEffect} from "react";
import MintShipsPage from "./pages/MintShip/MintShipsPage";
import {useWalletStore} from "./store/useWalletStore";
import CreateTeamPage from "./pages/CreateTeamPage/CreateTeamPage";
import Home from "./pages/Home/Home";

function App() {
    const { checkConnection } = useWalletStore();

    useEffect(() => {
        checkConnection();
    }, [checkConnection]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mint" element={<MintShips />} />
                <Route path="/mintPage" element={<MintPage />} />
                <Route path="/mint-ships" element={<MintShipsPage />} />
                <Route path="/create-team" element={<CreateTeamPage />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
