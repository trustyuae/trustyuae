import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./redux/store"

import "./assets/vendor/bootstrap/css/bootstrap.min.css"
import "./assets/vendor/bootstrap-icons/bootstrap-icons.css"
import "./assets/vendor/boxicons/css/boxicons.min.css"
import "./assets/vendor/remixicon/remixicon.css"

import "./assets/vendor/bootstrap/js/bootstrap.bundle.min.js"
import "./assets/vendor/tinymce/tinymce.min.js"
import "./assets/js/main.js"
import './lib/i18n'
import i18next from "i18next";
i18next.init({
  interpolation: { escapeValue: false },  // React already does escaping
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();
