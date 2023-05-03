import { FirstPage } from "./FirstPage/FirstPage";
import { SecondPage } from "./SecondPage/SecondPage";
import { VehiclePage } from "./VehiclePage";
import { loadPodData } from "./loadPodData";
import { Navigate } from "react-router-dom";

export const vehicleRoute = {
    path: "/vehicle",
    element: <VehiclePage />,
    loader: loadPodData,
    children: [
        { path: "first", element: <FirstPage /> },
        { path: "second", element: <SecondPage /> },
        {
            path: "",
            element: <Navigate to="first" />,
        },
        {
            path: "*",
            element: <Navigate to="first" />,
        },
    ],
};
