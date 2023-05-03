import { Measurements } from "common";
import { LevitationData } from "../PCUSection/PCUData";

export function extractLevitationData(
    measurements: Measurements
): LevitationData {
    return {
        general_state: measurements["general_state"],
        specific_state: measurements["specific_state"],
        slave_general_state: measurements["slave_general_state"],
        slave_specific_state: measurements["slave_specific_state"],

        airgap_1: measurements["airgap_1"],
        airgap_2: measurements["airgap_2"],
        airgap_3: measurements["airgap_3"],
        airgap_4: measurements["airgap_4"],
        slave_airgap_5: measurements["slave_airgap_5"],
        slave_airgap_6: measurements["slave_airgap_6"],
        slave_airgap_7: measurements["slave_airgap_7"],
        slave_airgap_8: measurements["slave_airgap_8"],

        current_coil_1: measurements["current_coil_1"],
        current_coil_2: measurements["current_coil_2"],
        current_coil_3: measurements["current_coil_3"],
        current_coil_4: measurements["current_coil_4"],
        slave_current_coil_5: measurements["slave_current_coil_5"],
        slave_current_coil_6: measurements["slave_current_coil_6"],
        slave_current_coil_7: measurements["slave_current_coil_7"],
        slave_current_coil_8: measurements["slave_current_coil_8"],

        temperature_coil_1: measurements["temperature_coil_1"],
        temperature_coil_2: measurements["temperature_coil_2"],
        temperature_coil_3: measurements["temperature_coil_3"],
        temperature_coil_4: measurements["temperature_coil_4"],
        slave_temperature_coil_5: measurements["slave_temperature_coil_5"],
        slave_temperature_coil_6: measurements["slave_temperature_coil_6"],
        slave_temperature_coil_7: measurements["slave_temperature_coil_7"],
        slave_temperature_coil_8: measurements["slave_temperature_coil_8"],

        temperature_lpu_1: measurements["temperature_lpu_1"],
        temperature_lpu_2: measurements["temperature_lpu_2"],
        temperature_lpu_3: measurements["temperature_lpu_3"],
        temperature_lpu_4: measurements["temperature_lpu_4"],
        slave_temperature_lpu_5: measurements["slave_temperature_lpu_5"],
        slave_temperature_lpu_6: measurements["slave_temperature_lpu_6"],
        slave_temperature_lpu_7: measurements["slave_temperature_lpu_7"],
        slave_temperature_lpu_8: measurements["slave_temperature_lpu_8"],

        battery_voltage_1: measurements["battery_voltage_1"],
        battery_voltage_2: measurements["battery_voltage_2"],
        slave_battery_voltage_3: measurements["slave_battery_voltage_3"],
        slave_battery_voltage_4: measurements["slave_battery_voltage_4"],

        battery_current_1: measurements["battery_current_1"],
        battery_current_2: measurements["battery_current_2"],
        slave_battery_current_3: measurements["slave_battery_current_3"],
        slave_battery_current_4: measurements["slave_battery_current_4"],

        reference_current_1: measurements["reference_current_1"],
        reference_current_2: measurements["reference_current_2"],
        reference_current_3: measurements["reference_current_3"],
        reference_current_4: measurements["reference_current_4"],
        slave_reference_current_5: measurements["slave_reference_current_5"],
        slave_reference_current_6: measurements["slave_reference_current_6"],
        slave_reference_current_7: measurements["slave_reference_current_7"],
        slave_reference_current_8: measurements["slave_reference_current_8"],

        rot_x: measurements["rot_x"],
        rot_y: measurements["rot_y"],
        rot_z: measurements["rot_z"],

        control_state: measurements["control_state"],
    } as LevitationData;
}
