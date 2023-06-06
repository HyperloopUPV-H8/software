import { EnumMeasurement, NumericMeasurement } from "../";
import { Measurements } from "../..";

export type LevitationData = {
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

const LPUId = "LPU";

export function extractLevitationData(
    measurements: Measurements
): LevitationData {
    return {
        general_state: measurements.boards[LPUId]["general_state"],
        specific_state: measurements.boards[LPUId]["specific_state"],
        slave_general_state: measurements.boards[LPUId]["slave_general_state"],
        slave_specific_state:
            measurements.boards[LPUId]["slave_specific_state"],

        airgap_1: measurements.boards[LPUId]["airgap_1"],
        airgap_2: measurements.boards[LPUId]["airgap_2"],
        airgap_3: measurements.boards[LPUId]["airgap_3"],
        airgap_4: measurements.boards[LPUId]["airgap_4"],
        slave_airgap_5: measurements.boards[LPUId]["slave_airgap_5"],
        slave_airgap_6: measurements.boards[LPUId]["slave_airgap_6"],
        slave_airgap_7: measurements.boards[LPUId]["slave_airgap_7"],
        slave_airgap_8: measurements.boards[LPUId]["slave_airgap_8"],

        current_coil_1: measurements.boards[LPUId]["current_coil_1"],
        current_coil_2: measurements.boards[LPUId]["current_coil_2"],
        current_coil_3: measurements.boards[LPUId]["current_coil_3"],
        current_coil_4: measurements.boards[LPUId]["current_coil_4"],
        slave_current_coil_5:
            measurements.boards[LPUId]["slave_current_coil_5"],
        slave_current_coil_6:
            measurements.boards[LPUId]["slave_current_coil_6"],
        slave_current_coil_7:
            measurements.boards[LPUId]["slave_current_coil_7"],
        slave_current_coil_8:
            measurements.boards[LPUId]["slave_current_coil_8"],

        temperature_coil_1: measurements.boards[LPUId]["temperature_coil_1"],
        temperature_coil_2: measurements.boards[LPUId]["temperature_coil_2"],
        temperature_coil_3: measurements.boards[LPUId]["temperature_coil_3"],
        temperature_coil_4: measurements.boards[LPUId]["temperature_coil_4"],
        slave_temperature_coil_5:
            measurements.boards[LPUId]["slave_temperature_coil_5"],
        slave_temperature_coil_6:
            measurements.boards[LPUId]["slave_temperature_coil_6"],
        slave_temperature_coil_7:
            measurements.boards[LPUId]["slave_temperature_coil_7"],
        slave_temperature_coil_8:
            measurements.boards[LPUId]["slave_temperature_coil_8"],

        temperature_lpu_1: measurements.boards[LPUId]["temperature_lpu_1"],
        temperature_lpu_2: measurements.boards[LPUId]["temperature_lpu_2"],
        temperature_lpu_3: measurements.boards[LPUId]["temperature_lpu_3"],
        temperature_lpu_4: measurements.boards[LPUId]["temperature_lpu_4"],
        slave_temperature_lpu_5:
            measurements.boards[LPUId]["slave_temperature_lpu_5"],
        slave_temperature_lpu_6:
            measurements.boards[LPUId]["slave_temperature_lpu_6"],
        slave_temperature_lpu_7:
            measurements.boards[LPUId]["slave_temperature_lpu_7"],
        slave_temperature_lpu_8:
            measurements.boards[LPUId]["slave_temperature_lpu_8"],

        battery_voltage_1: measurements.boards[LPUId]["battery_voltage_1"],
        battery_voltage_2: measurements.boards[LPUId]["battery_voltage_2"],
        slave_battery_voltage_3:
            measurements.boards[LPUId]["slave_battery_voltage_3"],
        slave_battery_voltage_4:
            measurements.boards[LPUId]["slave_battery_voltage_4"],

        battery_current_1: measurements.boards[LPUId]["battery_current_1"],
        battery_current_2: measurements.boards[LPUId]["battery_current_2"],
        slave_battery_current_3:
            measurements.boards[LPUId]["slave_battery_current_3"],
        slave_battery_current_4:
            measurements.boards[LPUId]["slave_battery_current_4"],

        reference_current_1: measurements.boards[LPUId]["reference_current_1"],
        reference_current_2: measurements.boards[LPUId]["reference_current_2"],
        reference_current_3: measurements.boards[LPUId]["reference_current_3"],
        reference_current_4: measurements.boards[LPUId]["reference_current_4"],
        slave_reference_current_5:
            measurements.boards[LPUId]["slave_reference_current_5"],
        slave_reference_current_6:
            measurements.boards[LPUId]["slave_reference_current_6"],
        slave_reference_current_7:
            measurements.boards[LPUId]["slave_reference_current_7"],
        slave_reference_current_8:
            measurements.boards[LPUId]["slave_reference_current_8"],

        rot_x: measurements.boards[LPUId]["rot_x"],
        rot_y: measurements.boards[LPUId]["rot_y"],
        rot_z: measurements.boards[LPUId]["rot_z"],

        control_state: measurements.boards[LPUId]["control_state"],
    } as LevitationData;
}
