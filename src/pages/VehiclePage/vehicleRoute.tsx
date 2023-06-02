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
        { path: "1", element: <FirstPage /> },
        { path: "2", element: <SecondPage /> },
        {
            path: "",
            element: <Navigate to="1" />,
        },
        {
            path: "*",
            element: <Navigate to="2" />,
        },
    ],
};
