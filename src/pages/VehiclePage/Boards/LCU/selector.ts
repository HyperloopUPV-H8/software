import {
    EnumMeasurement,
    Measurements,
    NumericMeasurement,
    getMeasurementFallback,
} from "common";

export type LcuMeasurements = {
    general_state: EnumMeasurement;
    specific_state: EnumMeasurement;
    slave_general_state: EnumMeasurement;
    slave_specific_state: EnumMeasurement;

    airgap_1: NumericMeasurement;
    airgap_2: NumericMeasurement;
    airgap_3: NumericMeasurement;
    airgap_4: NumericMeasurement;
    slave_airgap_5: NumericMeasurement;
    slave_airgap_6: NumericMeasurement;
    slave_airgap_7: NumericMeasurement;
    slave_airgap_8: NumericMeasurement;

    current_coil_1: NumericMeasurement;
    current_coil_2: NumericMeasurement;
    current_coil_3: NumericMeasurement;
    current_coil_4: NumericMeasurement;
    slave_current_coil_5: NumericMeasurement;
    slave_current_coil_6: NumericMeasurement;
    slave_current_coil_7: NumericMeasurement;
    slave_current_coil_8: NumericMeasurement;

    temperature_coil_1: NumericMeasurement;
    temperature_coil_2: NumericMeasurement;
    temperature_coil_3: NumericMeasurement;
    temperature_coil_4: NumericMeasurement;
    slave_temperature_coil_5: NumericMeasurement;
    slave_temperature_coil_6: NumericMeasurement;
    slave_temperature_coil_7: NumericMeasurement;
    slave_temperature_coil_8: NumericMeasurement;

    temperature_lpu_1: NumericMeasurement;
    temperature_lpu_2: NumericMeasurement;
    temperature_lpu_3: NumericMeasurement;
    temperature_lpu_4: NumericMeasurement;
    slave_temperature_lpu_5: NumericMeasurement;
    slave_temperature_lpu_6: NumericMeasurement;
    slave_temperature_lpu_7: NumericMeasurement;
    slave_temperature_lpu_8: NumericMeasurement;

    battery_voltage_1: NumericMeasurement;
    battery_voltage_2: NumericMeasurement;
    slave_battery_voltage_3: NumericMeasurement;
    slave_battery_voltage_4: NumericMeasurement;

    battery_current_1: NumericMeasurement;
    battery_current_2: NumericMeasurement;
    slave_battery_current_3: NumericMeasurement;
    slave_battery_current_4: NumericMeasurement;

    reference_current_1: NumericMeasurement;
    reference_current_2: NumericMeasurement;
    reference_current_3: NumericMeasurement;
    reference_current_4: NumericMeasurement;
    slave_reference_current_5: NumericMeasurement;
    slave_reference_current_6: NumericMeasurement;
    slave_reference_current_7: NumericMeasurement;
    slave_reference_current_8: NumericMeasurement;

    rot_x: NumericMeasurement;
    rot_y: NumericMeasurement;
    rot_z: NumericMeasurement;

    control_state: EnumMeasurement;
};

export function selectLcuMeasurements(
    measurements: Measurements
): LcuMeasurements {
    return {
        general_state: getMeasurementFallback(
            measurements,
            "LCU_MASTER/general_state"
        ),
        specific_state: getMeasurementFallback(
            measurements,
            "LCU_MASTER/specific_state"
        ),
        slave_general_state: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_general_state"
        ),
        slave_specific_state: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_specific_state"
        ),

        airgap_1: getMeasurementFallback(measurements, "LCU_MASTER/airgap_1"),
        airgap_2: getMeasurementFallback(measurements, "LCU_MASTER/airgap_2"),
        airgap_3: getMeasurementFallback(measurements, "LCU_MASTER/airgap_3"),
        airgap_4: getMeasurementFallback(measurements, "LCU_MASTER/airgap_4"),
        slave_airgap_5: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_airgap_5"
        ),
        slave_airgap_6: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_airgap_6"
        ),
        slave_airgap_7: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_airgap_7"
        ),
        slave_airgap_8: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_airgap_8"
        ),

        current_coil_1: getMeasurementFallback(
            measurements,
            "LCU_MASTER/current_coil_1"
        ),
        current_coil_2: getMeasurementFallback(
            measurements,
            "LCU_MASTER/current_coil_2"
        ),
        current_coil_3: getMeasurementFallback(
            measurements,
            "LCU_MASTER/current_coil_3"
        ),
        current_coil_4: getMeasurementFallback(
            measurements,
            "LCU_MASTER/current_coil_4"
        ),
        slave_current_coil_5: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_current_coil_5"
        ),
        slave_current_coil_6: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_current_coil_6"
        ),
        slave_current_coil_7: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_current_coil_7"
        ),
        slave_current_coil_8: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_current_coil_8"
        ),

        temperature_coil_1: getMeasurementFallback(
            measurements,
            "LCU_MASTER/temperature_coil_1"
        ),
        temperature_coil_2: getMeasurementFallback(
            measurements,
            "LCU_MASTER/temperature_coil_2"
        ),
        temperature_coil_3: getMeasurementFallback(
            measurements,
            "LCU_MASTER/temperature_coil_3"
        ),
        temperature_coil_4: getMeasurementFallback(
            measurements,
            "LCU_MASTER/temperature_coil_4"
        ),
        slave_temperature_coil_5: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_temperature_coil_5"
        ),
        slave_temperature_coil_6: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_temperature_coil_6"
        ),
        slave_temperature_coil_7: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_temperature_coil_7"
        ),
        slave_temperature_coil_8: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_temperature_coil_8"
        ),

        temperature_lpu_1: getMeasurementFallback(
            measurements,
            "LCU_MASTER/temperature_lpu_1"
        ),
        temperature_lpu_2: getMeasurementFallback(
            measurements,
            "LCU_MASTER/temperature_lpu_2"
        ),
        temperature_lpu_3: getMeasurementFallback(
            measurements,
            "LCU_MASTER/temperature_lpu_3"
        ),
        temperature_lpu_4: getMeasurementFallback(
            measurements,
            "LCU_MASTER/temperature_lpu_4"
        ),
        slave_temperature_lpu_5: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_temperature_lpu_5"
        ),
        slave_temperature_lpu_6: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_temperature_lpu_6"
        ),
        slave_temperature_lpu_7: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_temperature_lpu_7"
        ),
        slave_temperature_lpu_8: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_temperature_lpu_8"
        ),

        battery_voltage_1: getMeasurementFallback(
            measurements,
            "LCU_MASTER/battery_voltage_1"
        ),
        battery_voltage_2: getMeasurementFallback(
            measurements,
            "LCU_MASTER/battery_voltage_2"
        ),
        slave_battery_voltage_3: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_battery_voltage_3"
        ),
        slave_battery_voltage_4: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_battery_voltage_4"
        ),

        battery_current_1: getMeasurementFallback(
            measurements,
            "LCU_MASTER/battery_current_1"
        ),
        battery_current_2: getMeasurementFallback(
            measurements,
            "LCU_MASTER/battery_current_2"
        ),
        slave_battery_current_3: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_battery_current_3"
        ),
        slave_battery_current_4: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_battery_current_4"
        ),

        reference_current_1: getMeasurementFallback(
            measurements,
            "LCU_MASTER/reference_current_1"
        ),
        reference_current_2: getMeasurementFallback(
            measurements,
            "LCU_MASTER/reference_current_2"
        ),
        reference_current_3: getMeasurementFallback(
            measurements,
            "LCU_MASTER/reference_current_3"
        ),
        reference_current_4: getMeasurementFallback(
            measurements,
            "LCU_MASTER/reference_current_4"
        ),
        slave_reference_current_5: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_reference_current_5"
        ),
        slave_reference_current_6: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_reference_current_6"
        ),
        slave_reference_current_7: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_reference_current_7"
        ),
        slave_reference_current_8: getMeasurementFallback(
            measurements,
            "LCU_MASTER/slave_reference_current_8"
        ),

        rot_x: getMeasurementFallback(measurements, "LCU_MASTER/rot_x"),
        rot_y: getMeasurementFallback(measurements, "LCU_MASTER/rot_y"),
        rot_z: getMeasurementFallback(measurements, "LCU_MASTER/rot_z"),

        control_state: measurements.measurements["LCU_MASTER/control_state"],
    } as LcuMeasurements;
}
