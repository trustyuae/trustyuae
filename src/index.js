import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
// import store from "../src/Redux2/Store";
import { store, persistor } from "../src/Redux2/store";

import "./assets/vendor/bootstrap/css/bootstrap.min.css";
import "./assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "./assets/vendor/boxicons/css/boxicons.min.css";
import "./assets/vendor/remixicon/remixicon.css";

import "./assets/vendor/bootstrap/js/bootstrap.bundle.min.js";
import "./assets/vendor/tinymce/tinymce.min.js";
import "./assets/js/main.js";
import "./lib/i18n.js";
import i18next from "i18next";
import { PersistGate } from "redux-persist/integration/react";
i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

reportWebVitals();
