import {
    ControlData,
    ControlDataNameMap,
} from "components/ControlSections/types/ControlData";
import { PodData } from "models/PodData/PodData";
import { useSectionData } from "./useSectionData";

export function useControlData(
    controlDataNameMap: ControlDataNameMap
): [ControlData, (boards: PodData["boards"]) => void] {
    const [pneumaticsData, setPneumaticsData] = useSectionData(
        controlDataNameMap.pneumaticsDataNameMap
    );

    const [navigationData, setNavigationData] = useSectionData(
        controlDataNameMap.navigationDataNameMap
    );

    function setControlData(boards: PodData["boards"]) {
        setPneumaticsData(boards);
        setNavigationData(boards);
    }

    const controlData = {
        pneumaticsData,
        navigationData,
    };

    return [controlData, setControlData];
}
