import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App";
import "./index.css";
import { BrokerProvider } from "common";
import { vehicleRoute } from "pages/VehiclePage/vehicleRoute";
import { camerasRoute } from "pages/CamerasPage/camerasRoute";
import { testingRoute } from "pages/TestingPage/testingRoute";
import { tubeRoute } from "pages/TubePage/tubeRoute";
import { BrokerLoader } from "components/BrokerLoader/BrokerLoader";
import { ImperativeUpdater } from "services/ImperativeUpdater/ImperativeUpdater";
import { GlobalTicker } from "hooks/GlobalTicker/GlobalTicker";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [vehicleRoute, camerasRoute, testingRoute, tubeRoute],
    },
]);

const WS_URL = `${import.meta.env.VITE_SERVER_IP}:${
    import.meta.env.VITE_SERVER_PORT
}${import.meta.env.VITE_BACKEND_WEBSOCKET_PATH}`;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrokerLoader
                url={WS_URL}
                LoadingView={<div>Loading broker...</div>}
            >
                <GlobalTicker>
                    <ImperativeUpdater>
                        <RouterProvider router={router}></RouterProvider>
                    </ImperativeUpdater>
                </GlobalTicker>
            </BrokerLoader>
        </Provider>
    </React.StrictMode>
);
