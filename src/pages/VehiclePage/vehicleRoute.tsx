import { FirstPage } from "./FirstPage/FirstPage";
import { ControlPage } from "./ControlPage/ControlPage";
import { VehiclePage } from "./VehiclePage";
import { loadPodData } from "./loadPodData";
import { Navigate } from "react-router-dom";

export const vehicleRoute = {
    path: "/vehicle",
    element: <VehiclePage />,
    loader: loadPodData,
    children: [
        { path: "", element: <Navigate to={"first"} /> },
        { path: "first", element: <FirstPage /> },
        { path: "second", element: <ControlPage /> },
    ],
};
