import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MintPage from "./pages/MintPage";
import Header from "./components/header/Header";

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/mint" element={<MintPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
