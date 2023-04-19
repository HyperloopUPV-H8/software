import { loadPodData } from "pages/VehiclePage/loadPodData";
import { TubePage } from "./TubePage";

export const tubeRoute = {
    path: "/tube",
    element: <TubePage />,
    loader: loadPodData,
};
