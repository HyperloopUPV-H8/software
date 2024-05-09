import { BoardsPage } from "./BoardsPage/BoardsPage";
import { ControlPage } from "./ControlPage/ControlPage";
import { VehiclePage } from "./VehiclePage";
import { Navigate } from "react-router-dom";

export const vehicleRoute = {
    path: "/vehicle",
    element: <VehiclePage />,
    children: [
        { path: "", element: <Navigate to={"first"} /> },
        { path: "first", element: <BoardsPage /> },
        { path: "second", element: <ControlPage /> },
    ],
};
