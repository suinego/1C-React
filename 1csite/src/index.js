import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store/store";
import "./styles/global.scss";

const rootEl = document.getElementById("root");
  const root = createRoot(rootEl);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );

