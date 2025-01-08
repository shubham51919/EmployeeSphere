import React from "react";

import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App";
import { Provider, teamsTheme } from "@fluentui/react-northstar";
import { Provider as ReduxProvider } from "react-redux";
import store from "./store";
const container = document.getElementById("root");

const root = createRoot(container);

root.render(
  <ReduxProvider store={store}>
    <Provider theme={teamsTheme}>
      <App />
    </Provider>
  </ReduxProvider>
);
