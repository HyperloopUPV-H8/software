import { Measurements, NumericMeasurement, useMeasurementsStore } from "..";

export type TcuMeasurements = {
    pressure: NumericMeasurement;
    temperature: NumericMeasurement;
};

export function selectTcuMeasurements(
    measurements: Measurements
): TcuMeasurements {
    
    const getMeasurementFallback = useMeasurementsStore(state => state.getMeasurementFallback);

    return {
        pressure: getMeasurementFallback("TCU/pressure"),
        temperature: getMeasurementFallback("TCU/temperature"),
    } as TcuMeasurements;
}
