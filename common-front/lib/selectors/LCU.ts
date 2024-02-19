import {
    EnumMeasurement,
    Measurements,
    NumericMeasurement,
    useMeasurementsStore
} from "..";

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

    temperature_hems_1: NumericMeasurement;
    temperature_hems_2: NumericMeasurement;
    temperature_hems_3: NumericMeasurement;
    temperature_hems_4: NumericMeasurement;

    temperature_ems_1: NumericMeasurement;
    temperature_ems_2: NumericMeasurement;
    temperature_ems_3: NumericMeasurement;
    temperature_ems_4: NumericMeasurement;

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

    const getMeasurementFallback = useMeasurementsStore(state => state.getMeasurementFallback);

    return {
        general_state: getMeasurementFallback(
            "LCU_MASTER/lcu_master_general_state"
        ),
        specific_state: getMeasurementFallback(
            "LCU_MASTER/lcu_master_specific_state"
        ),
        slave_general_state: getMeasurementFallback(
            "LCU_MASTER/lcu_master_slave_general_state"
        ),
        slave_specific_state: getMeasurementFallback(
            "LCU_MASTER/lcu_master_slave_specific_state"
        ),

        airgap_1: getMeasurementFallback(
            "LCU_MASTER/lcu_master_airgap_1"
        ),
        airgap_2: getMeasurementFallback(
            "LCU_MASTER/lcu_master_slave_airgap_2"
        ),
        airgap_3: getMeasurementFallback(
            "LCU_MASTER/lcu_master_airgap_3"
        ),
        airgap_4: getMeasurementFallback(
            "LCU_MASTER/lcu_master_slave_airgap_4"
        ),
        slave_airgap_5: getMeasurementFallback(
            "LCU_MASTER/lcu_master_airgap_5"
        ),
        slave_airgap_6: getMeasurementFallback(
            "LCU_MASTER/lcu_master_slave_airgap_6"
        ),
        slave_airgap_7: getMeasurementFallback(
            "LCU_MASTER/lcu_master_airgap_7"
        ),
        slave_airgap_8: getMeasurementFallback(
            "LCU_MASTER/lcu_master_slave_airgap_8"
        ),

        current_coil_1: getMeasurementFallback(
            "LCU_MASTER/lcu_master_current_coil_hems_1"
        ),
        current_coil_2: getMeasurementFallback(
            "LCU_MASTER/lcu_master_current_coil_hems_3"
        ),
        current_coil_3: getMeasurementFallback(
            "LCU_MASTER/lcu_master_current_coil_ems_1"
        ),
        current_coil_4: getMeasurementFallback(
            "LCU_MASTER/lcu_master_current_coil_ems_3"
        ),
        slave_current_coil_5: getMeasurementFallback(
            "LCU_MASTER/lcu_master_slave_current_coil_hems_2"
        ),
        slave_current_coil_6: getMeasurementFallback(
            "LCU_MASTER/lcu_master_slave_current_coil_hems_4"
        ),
        slave_current_coil_7: getMeasurementFallback(
            "LCU_MASTER/lcu_master_slave_current_coil_ems_2"
        ),
        slave_current_coil_8: getMeasurementFallback(
            "LCU_MASTER/lcu_master_slave_current_coil_ems_4"
        ),

        temperature_hems_1: getMeasurementFallback(
            "LCU_MASTER/lcu_master_temperature_hems_1"
        ),
        temperature_hems_2: getMeasurementFallback(
            "LCU_MASTER/lcu_master_temperature_hems_2"
        ),
        temperature_hems_3: getMeasurementFallback(
            "LCU_MASTER/lcu_master_temperature_hems_3"
        ),
        temperature_hems_4: getMeasurementFallback(
            "LCU_MASTER/lcu_master_temperature_hems_4"
        ),
        temperature_ems_1: getMeasurementFallback(
            "LCU_MASTER/lcu_master_temperature_ems_1"
        ),
        temperature_ems_2: getMeasurementFallback(
            "LCU_MASTER/lcu_master_temperature_ems_2"
        ),
        temperature_ems_3: getMeasurementFallback(
            "LCU_MASTER/lcu_master_temperature_ems_3"
        ),
        temperature_ems_4: getMeasurementFallback(
            "LCU_MASTER/lcu_master_temperature_ems_4"
        ),

        temperature_lpu_1: getMeasurementFallback(
            "LCU_MASTER/lcu_master_temperature_lpu_1"
        ),
        temperature_lpu_2: getMeasurementFallback(
            "LCU_MASTER/lcu_master_temperature_lpu_2"
        ),
        temperature_lpu_3: getMeasurementFallback(
            "LCU_MASTER/lcu_master_temperature_lpu_3"
        ),
        temperature_lpu_4: getMeasurementFallback(
            "LCU_MASTER/lcu_master_temperature_lpu_4"
        ),
        slave_temperature_lpu_5: getMeasurementFallback(
            "LCU_MASTER/lcu_master_slave_temperature_lpu_5"
        ),
        slave_temperature_lpu_6: getMeasurementFallback(
            "LCU_MASTER/lcu_master_slave_temperature_lpu_6"
        ),
        slave_temperature_lpu_7: getMeasurementFallback(
            "LCU_MASTER/lcu_master_slave_temperature_lpu_7"
        ),
        slave_temperature_lpu_8: getMeasurementFallback(
            "LCU_MASTER/lcu_master_slave_temperature_lpu_8"
        ),

        battery_voltage_1: getMeasurementFallback(
            "LCU_MASTER/lcu_master_battery_voltage_1"
        ),
        battery_voltage_2: getMeasurementFallback(
            "LCU_MASTER/lcu_master_battery_voltage_2"
        ),
        slave_battery_voltage_3: getMeasurementFallback(
            "LCU_MASTER/lcu_master_slave_battery_voltage_3"
        ),
        slave_battery_voltage_4: getMeasurementFallback(
            "LCU_MASTER/lcu_master_slave_battery_voltage_4"
        ),

        reference_current_1: getMeasurementFallback(
            "LCU_MASTER/lcu_master_reference_current_hems_1"
        ),
        reference_current_2: getMeasurementFallback(
            "LCU_MASTER/lcu_master_reference_current_hems_2"
        ),
        reference_current_3: getMeasurementFallback(
            "LCU_MASTER/lcu_master_reference_current_hems_3"
        ),
        reference_current_4: getMeasurementFallback(
            "LCU_MASTER/lcu_master_reference_current_hems_4"
        ),
        slave_reference_current_5: getMeasurementFallback(
            "LCU_MASTER/lcu_master_reference_current_ems_1"
        ),
        slave_reference_current_6: getMeasurementFallback(
            "LCU_MASTER/lcu_master_reference_current_ems_2"
        ),
        slave_reference_current_7: getMeasurementFallback(
            "LCU_MASTER/lcu_master_reference_current_ems_3"
        ),
        slave_reference_current_8: getMeasurementFallback(
            "LCU_MASTER/lcu_master_reference_current_ems_4"
        ),

        rot_x: getMeasurementFallback(
            "LCU_MASTER/lcu_master_rot_x"
        ),
        rot_y: getMeasurementFallback(
            "LCU_MASTER/lcu_master_rot_y"
        ),
        rot_z: getMeasurementFallback(
            "LCU_MASTER/lcu_master_rot_z"
        ),

        control_state:
            measurements["LCU_MASTER/lcu_master_control_state"],
    } as LcuMeasurements;
}
