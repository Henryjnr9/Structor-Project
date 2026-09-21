import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Import Open Sauce Sans font weights
import "@fontsource/open-sauce-sans"; // 400 (Regular)
import "@fontsource/open-sauce-sans/500.css"; // 500 (Medium)
import "@fontsource/open-sauce-sans/600.css"; // 600 (Semi-Bold)
import "@fontsource/open-sauce-sans/700.css"; // 700 (Bold)

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
