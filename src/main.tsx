import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { store } from "./store";
import { Provider } from "react-redux";
import { WebSocketBrokerProvider } from "services/WebSocketBroker/WebSocketBrokerContext";
import { setWebSocketConnection } from "slices/connectionsSlice";
const SERVER_URL = `${import.meta.env.VITE_SERVER_IP}:${
    import.meta.env.VITE_SERVER_PORT
}${import.meta.env.VITE_BACKEND_WEBSOCKET_PATH}`;

function handleSocketOpen() {
    store.dispatch(setWebSocketConnection(true));
}

function handleSocketClose() {
    store.dispatch(setWebSocketConnection(false));
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <WebSocketBrokerProvider
                url={SERVER_URL}
                onOpen={handleSocketOpen}
                onClose={handleSocketClose}
            >
                <App />
            </WebSocketBrokerProvider>
        </Provider>
    </React.StrictMode>
);
