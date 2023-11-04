import { NumericMeasurement } from "common";

export type CoilData = {
    current: NumericMeasurement;
    currentRef: NumericMeasurement;
    temperature: NumericMeasurement;
};
