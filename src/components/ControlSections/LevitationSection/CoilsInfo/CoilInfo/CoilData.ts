import { Measurement } from "models/PodData/Measurement";
export type CoilData = {
    current: Measurement;
    currentRef: Measurement;
    temperature: Measurement;
};
