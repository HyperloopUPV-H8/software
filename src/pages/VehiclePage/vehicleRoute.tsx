import { VehiclePage } from "./VehiclePage";
import { loadPodData } from "./loadPodData";
import { Navigate } from "react-router-dom";

export const vehicleRoute = {
    path: "/vehicle",
    element: <VehiclePage />,
    loader: loadPodData,
    children: [
        { path: "first", element: <div>Hello first</div> },
        { path: "second", element: <div>Hello second</div> },
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
