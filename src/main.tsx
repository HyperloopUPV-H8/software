import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { store } from "./store";
import { Provider } from "react-redux";
import { WebSocketBrokerProvider } from "services/WebSocketBroker/WebSocketBrokerContext";

const SERVER_URL = `${import.meta.env.VITE_SERVER_IP}:${
    import.meta.env.VITE_SERVER_PORT
}${import.meta.env.VITE_BACKEND_WEBSOCKET_PATH}`;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <WebSocketBrokerProvider url={SERVER_URL}>
                <App />
            </WebSocketBrokerProvider>
        </Provider>
    </React.StrictMode>
);
