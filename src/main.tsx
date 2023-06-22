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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <GlobalTicker fps={60}>
                <RouterProvider router={router}></RouterProvider>
            </GlobalTicker>
        </Provider>
    </React.StrictMode>
);
