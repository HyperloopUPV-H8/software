import { NumericValue } from "models/PodData/Measurement";

export type PacketUpdate = {
    id: number;
    hexValue: number;
    cycleTime: number;
    count: number;
    measurementUpdates: { [name: string]: NumericValue | boolean | string };
};
