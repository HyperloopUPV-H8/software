import {
    BooleanMeasurement,
    Measurements,
    NumericMeasurement,
    getMeasurementFallback,
} from "common";

export type BmslMeasurements = {
    stateOfCharge: NumericMeasurement;
    minimumVoltage: NumericMeasurement;
    maximumVoltage: NumericMeasurement;
    temp1: NumericMeasurement;
    temp2: NumericMeasurement;
    balancing: BooleanMeasurement;
    totalVoltage: NumericMeasurement;
};

export function selectBmslMeasurements(
    measurements: Measurements
): BmslMeasurements {
    return {
        balancing: getMeasurementFallback(measurements, "BMSL/balancing"),
        maximumVoltage: getMeasurementFallback(
            measurements,
            "BMSL/maximumVoltage"
        ),
        minimumVoltage: getMeasurementFallback(
            measurements,
            "BMSL/minimumVoltage"
        ),
        stateOfCharge: getMeasurementFallback(
            measurements,
            "BMSL/stateOfCharge"
        ),
        temp1: getMeasurementFallback(measurements, "BMSL/temp1"),
        temp2: getMeasurementFallback(measurements, "BMSL/temp2"),
        totalVoltage: getMeasurementFallback(measurements, "BMSL/totalVoltage"),
    } as BmslMeasurements;
}
