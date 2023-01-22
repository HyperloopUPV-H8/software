import { SectionData } from "components/ControlSections/types/SectionData";

export type PneumaticsProperties =
    | "bottle1"
    | "bottle2"
    | "lowPressure"
    | "midPressure"
    | "highPressure"
    | "additionalValues";

export type PneumaticsData = SectionData<PneumaticsProperties>;
