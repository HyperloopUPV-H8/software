import {
    BooleanMeasurement,
    EnumMeasurement,
    Measurements,
    NumericMeasurement,
    getMeasurementFallback,
} from "..";

export type VcuMeasurements = {
    general_state: EnumMeasurement;
    specific_state: EnumMeasurement;
    voltage_state: EnumMeasurement;
    reference_pressure: NumericMeasurement;
    actual_pressure: NumericMeasurement;
    valve_state: BooleanMeasurement;
    reed1: EnumMeasurement;
    reed2: EnumMeasurement;
    bottle_temp_1: NumericMeasurement;
    bottle_temp_2: NumericMeasurement;
    high_pressure: NumericMeasurement;
    position: NumericMeasurement;
    speed: NumericMeasurement;
};

export function selectVcuMeasurements(
    measurements: Measurements
): VcuMeasurements {
    return {
        general_state: getMeasurementFallback(
            measurements,
            "VCU/general_state"
        ),

        specific_state: getMeasurementFallback(
            measurements,
            "VCU/specific_state"
        ),
        voltage_state: getMeasurementFallback(
            measurements,
            "VCU/voltage_state"
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
        reed1: getMeasurementFallback(measurements, "VCU/reed1"),
        reed2: getMeasurementFallback(measurements, "VCU/reed2"),
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
        position: getMeasurementFallback(measurements, "VCU/position"),
        speed: getMeasurementFallback(measurements, "VCU/speed"),
    } as VcuMeasurements;
}
