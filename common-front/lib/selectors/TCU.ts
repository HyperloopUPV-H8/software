import { Measurements, NumericMeasurement, getMeasurementFallback } from "..";

export type TcuMeasurements = {
    pressure: NumericMeasurement;
    temperature: NumericMeasurement;
};

export function selectTcuMeasurements(
    measurements: Measurements
): TcuMeasurements {
    return {
        pressure: getMeasurementFallback(measurements, "TCU/pressure"),
        temperature: getMeasurementFallback(measurements, "TCU/temperature"),
    } as TcuMeasurements;
}
