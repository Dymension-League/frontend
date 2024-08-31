import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>,
);
