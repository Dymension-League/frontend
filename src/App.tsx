import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home01 from "./pages/Home01";
import MintShips from "./pages/MintShips";
import MintPage from "./pages/MintPage";
import React, {useEffect} from "react";
import MintShipsPage from "./pages/MintShipsPage";
import {useWalletStore} from "./store/useWalletStore";

function App() {
    const { checkConnection } = useWalletStore();

    useEffect(() => {
        checkConnection();
    }, [checkConnection]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home01 />} />
                <Route path="/mint" element={<MintShips />} />
                <Route path="/mintPage" element={<MintPage />} />
                <Route path="/mint-ships" element={<MintShipsPage />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
