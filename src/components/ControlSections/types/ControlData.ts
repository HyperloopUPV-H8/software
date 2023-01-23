import {
    ModelNameMap,
    SectionData,
} from "components/ControlSections/types/SectionData";
import { NavigationProperties } from "components/ControlSections/NavigationSection/NavigationData";
import { PneumaticsProperties } from "components/ControlSections/PneumaticsSection/PneumaticsData";

export type ControlDataNameMap = {
    pneumaticsDataNameMap: ModelNameMap<PneumaticsProperties>;
    navigationDataNameMap: ModelNameMap<NavigationProperties>;
};

export type ControlData = {
    pneumaticsData: SectionData<PneumaticsProperties>;
    navigationData: SectionData<NavigationProperties>;
};
