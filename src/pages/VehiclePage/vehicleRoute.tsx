import { VehiclePage } from "./VehiclePage";
import { loadPodData } from "./loadPodData";

export const vehicleRoute = {
    path: "/vehicle",
    element: <VehiclePage />,
    loader: loadPodData,
};
