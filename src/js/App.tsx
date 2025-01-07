import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Main from "./Main";
import "./index.css";
import { Provider } from "react-redux";
import { persistor, store } from "../store/index";
import { PersistGate } from "redux-persist/integration/react";

const container = document.getElementById("app");
if (!container) throw new Error("Failed to find the root element");

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
