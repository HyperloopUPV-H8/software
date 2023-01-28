import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { store } from "./store";
import { Provider } from "react-redux";
import { BackendWebSocketContext } from "services/WebSocketHandler";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <BackendWebSocketContext>
                <App />
            </BackendWebSocketContext>
        </Provider>
    </React.StrictMode>
);
