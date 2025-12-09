import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.scss";

const rootEl = document.getElementById("root");
createRoot(rootEl).render(<App />);
