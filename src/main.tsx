import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { store } from "store";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App";
import { ControlPage } from "pages/ControlPage/ControlPage";

import "./index.css";
import { loadPodData } from "pages/ControlPage/loadPodData";
import { WebSocketBrokerProvider } from "services/WebSocketBroker/WebSocketBrokerContext";
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/vehicle",
                element: <ControlPage />,
                loader: loadPodData,
            },
        ],
    },
]);

const SERVER_URL = `${import.meta.env.VITE_SERVER_IP}:${
    import.meta.env.VITE_SERVER_PORT
}${import.meta.env.VITE_BACKEND_WEBSOCKET_PATH}`;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <WebSocketBrokerProvider
                url={SERVER_URL}
                onOpen={() => {}}
                onClose={() => {}}
            >
                <RouterProvider router={router}></RouterProvider>
            </WebSocketBrokerProvider>
        </Provider>
    </React.StrictMode>
);
