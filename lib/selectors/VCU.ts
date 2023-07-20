import {
    BooleanMeasurement,
    EnumMeasurement,
    Measurements,
    NumericMeasurement,
    getMeasurementFallback,
} from "..";

export type VcuMeasurements = {
    general_state: EnumMeasurement;
    reference_pressure: NumericMeasurement;
    actual_pressure: NumericMeasurement;
    valve_state: BooleanMeasurement;
    reed_state: BooleanMeasurement;
    bottle_temp_1: NumericMeasurement;
    bottle_temp_2: NumericMeasurement;
    high_pressure: NumericMeasurement;
};

export function selectVcuMeasurements(
    measurements: Measurements
): VcuMeasurements {
    return {
        general_state: getMeasurementFallback(
            measurements,
            "VCU/general_state"
        ),
        reference_pressure: getMeasurementFallback(
            measurements,
            "VCU/reference_pressure"
        ),
        actual_pressure: getMeasurementFallback(
            measurements,
            "VCU/actual_pressure"
        ),
        valve_state: getMeasurementFallback(measurements, "VCU/valve_state"),
        reed_state: getMeasurementFallback(measurements, "VCU/reed_state"),
        bottle_temp_1: getMeasurementFallback(
            measurements,
            "VCU/bottle_temp_1"
        ),
        bottle_temp_2: getMeasurementFallback(
            measurements,
            "VCU/bottle_temp_2"
        ),
        high_pressure: getMeasurementFallback(
            measurements,
            "VCU/high_pressure"
        ),
    } as VcuMeasurements;
}
