import React from "react";
import ReactDOM from "react-dom/client";
import "common/dist/style.css";
import App from "./App";
import "styles/fonts.scss";
import "./index.scss";
import { store } from "./store";
import { Provider } from "react-redux";
import { ConfigProvider, GlobalTicker } from "common";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <ConfigProvider
                devIp="127.0.0.1"
                prodIp="127.0.0.1"
            >
                <GlobalTicker fps={100}>
                    <App />
                </GlobalTicker>
            </ConfigProvider>
        </Provider>
    </React.StrictMode>
);
