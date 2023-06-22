import { NumericMeasurement } from "..";
import { Measurements } from "../..";

export type PcuMeasurements = {
    velocity: NumericMeasurement;
    vel_x: NumericMeasurement;
    vel_y: NumericMeasurement;
    vel_z: NumericMeasurement;
    acceleration: NumericMeasurement;
    acc_x: NumericMeasurement;
    acc_y: NumericMeasurement;
    acc_z: NumericMeasurement;

    motor_1_current_u: NumericMeasurement;
    motor_1_current_v: NumericMeasurement;
    motor_1_current_w: NumericMeasurement;
    motor_2_current_u: NumericMeasurement;
    motor_2_current_v: NumericMeasurement;
    motor_2_current_w: NumericMeasurement;
    motor_1_temp: NumericMeasurement;
    motor_2_temp: NumericMeasurement;

    battery_1_voltage: NumericMeasurement;
    battery_1_current: NumericMeasurement;
    battery_2_voltage: NumericMeasurement;
    battery_2_current: NumericMeasurement;

    temp_1: NumericMeasurement;
    temp_2: NumericMeasurement;
    temp_3: NumericMeasurement;
    temp_4: NumericMeasurement;
    temp_5: NumericMeasurement;
    temp_6: NumericMeasurement;
};

export function selectPcuMeasurements(measurements: Measurements) {
    return {
        velocity: measurements["PCU/velocity"],
        vel_x: measurements["PCU/vel_x"],
        vel_y: measurements["PCU/vel_y"],
        vel_z: measurements["PCU/vel_z"],
        acceleration: measurements["PCU/acceleration"],
        acc_x: measurements["PCU/acc_x"],
        acc_y: measurements["PCU/acc_y"],
        acc_z: measurements["PCU/acc_z"],

        motor_1_current_u: measurements["PCU/motor_1_current_u"],
        motor_1_current_v: measurements["PCU/motor_1_current_v"],
        motor_1_current_w: measurements["PCU/motor_1_current_w"],
        motor_2_current_u: measurements["PCU/motor_2_current_u"],
        motor_2_current_v: measurements["PCU/motor_2_current_v"],
        motor_2_current_w: measurements["PCU/motor_2_current_w"],
        motor_1_temp: measurements["PCU/motor_1_temp"],
        motor_2_temp: measurements["PCU/motor_2_temp"],

        battery_1_voltage: measurements["PCU/battery_1_voltage"],
        battery_1_current: measurements["PCU/battery_1_current"],
        battery_2_voltage: measurements["PCU/battery_2_voltage"],
        battery_2_current: measurements["PCU/battery_2_current"],

        temp_1: measurements["PCU/temp_1"],
        temp_2: measurements["PCU/temp_2"],
        temp_3: measurements["PCU/temp_3"],
        temp_4: measurements["PCU/temp_4"],
        temp_5: measurements["PCU/temp_5"],
        temp_6: measurements["PCU/temp_6"],
    } as PcuMeasurements;
}
