import { Measurement } from "models/PodData/Measurement";

export type AdditionalValues = "additionalValues";

export type ModelNameMap<T extends string> = {
    [Key in T]: Key extends "additionalValues" ? string[] : string;
};

export type SectionData<T extends string> = {
    [Key in T]: Key extends "additionalValues" ? Measurement[] : Measurement;
};

export function isAdditionalValues<T>(
    property: string
): property is "additionalValues" {
    return property == "additionalValues";
}
