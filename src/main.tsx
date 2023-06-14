import React from "react";
import ReactDOM from "react-dom/client";
import "common/dist/style.css";
import App from "./App";
import "styles/fonts.scss";
import "./index.scss";
import { store } from "./store";
import { Provider } from "react-redux";
import { GlobalTicker } from "common";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    // <React.StrictMode>
    <Provider store={store}>
        <GlobalTicker fps={100}>
            <App />
        </GlobalTicker>
    </Provider>
    // </React.StrictMode>
);
