import { getDefaultMeasurement } from "models/PodData/Measurement";
import { SectionData } from "components/ControlSections/types/SectionData";
import { ModelNameMap } from "components/ControlSections/types/SectionData";
export type NavigationProperties =
    | "velocity"
    | "position"
    | "additionalMeasurements";

export type NavigationDataNameMap = ModelNameMap<NavigationProperties>;
export type NavigationData = SectionData<NavigationProperties>;
