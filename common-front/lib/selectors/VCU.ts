import {
    BooleanMeasurement,
    EnumMeasurement,
    Measurements,
    NumericMeasurement,
    useMeasurementsStore,
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
    const getMeasurementFallback = useMeasurementsStore(
        (state) => state.getMeasurementFallback
    );

    return {
        general_state: getMeasurementFallback("VCU/general_state"),

        specific_state: getMeasurementFallback("VCU/specific_state"),
        voltage_state: getMeasurementFallback("VCU/voltage_state"),
        reference_pressure: getMeasurementFallback("VCU/reference_pressure"),
        actual_pressure: getMeasurementFallback("VCU/actual_pressure"),
        valve_state: getMeasurementFallback("VCU/valve_state"),
        reed1: getMeasurementFallback("VCU/reed1"),
        reed2: getMeasurementFallback("VCU/reed2"),
        bottle_temp_1: getMeasurementFallback("VCU/bottle_temp_1"),
        bottle_temp_2: getMeasurementFallback("VCU/bottle_temp_2"),
        high_pressure: getMeasurementFallback("VCU/high_pressure"),
        position: getMeasurementFallback("VCU/position"),
        speed: getMeasurementFallback("VCU/speed"),
    } as VcuMeasurements;
}
