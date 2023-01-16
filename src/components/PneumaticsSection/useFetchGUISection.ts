import { PneumaticsModel } from "components/PneumaticsSection/PneumaticsSectionModel";

type GUISectionName =
    | "pneumatics"
    | "levitation"
    | "navigation"
    | "bmsAvionics"
    | "bmsHigh";

type GUISectionModelFromName<T> = T extends "pneumatics" ? PneumaticsModel : [];

export function useFetchGUISection<T extends GUISectionName>(
    sectionName: T
): GUISectionModelFromName<typeof sectionName> {
    return {};
}
