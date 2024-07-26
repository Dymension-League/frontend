import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MintPage from "./pages/MintPage";
import Home01 from "./pages/Home01";

function App() {
  return (
    <>
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home01 />} />
          <Route path="/mint" element={<MintPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
