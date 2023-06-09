import "common/dist/style.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "store";
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
import { App } from "./App";
import "./index.css";
import { vehicleRoute } from "pages/VehiclePage/vehicleRoute";
import { camerasRoute } from "pages/CamerasPage/camerasRoute";
import { tubeRoute } from "pages/TubePage/tubeRoute";
import { ImperativeUpdater } from "services/ImperativeUpdater/ImperativeUpdater";
import { GlobalTicker } from "common";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <Navigate to={"vehicle"} /> },
            vehicleRoute,
            camerasRoute,
            tubeRoute,
        ],
    },
]);

const WS_URL = `${import.meta.env.VITE_SERVER_IP}:${
    import.meta.env.VITE_SERVER_PORT
}${import.meta.env.VITE_BACKEND_WEBSOCKET_PATH}`;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <GlobalTicker>
                <ImperativeUpdater>
                    <RouterProvider router={router}></RouterProvider>
                </ImperativeUpdater>
            </GlobalTicker>
        </Provider>
    </React.StrictMode>
);
