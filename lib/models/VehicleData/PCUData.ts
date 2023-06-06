import { NumericMeasurement } from "../";
import { Measurements } from "../..";

export type PCUData = {
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

const PCUId = "PCU";

export function extractPCUData(measurements: Measurements): PCUData {
    return {
        velocity: measurements.boards[PCUId]["velocity"],
        vel_x: measurements.boards[PCUId]["vel_x"],
        vel_y: measurements.boards[PCUId]["vel_y"],
        vel_z: measurements.boards[PCUId]["vel_z"],
        acceleration: measurements.boards[PCUId]["acceleration"],
        acc_x: measurements.boards[PCUId]["acc_x"],
        acc_y: measurements.boards[PCUId]["acc_y"],
        acc_z: measurements.boards[PCUId]["acc_z"],

        motor_1_current_u: measurements.boards[PCUId]["motor_1_current_u"],
        motor_1_current_v: measurements.boards[PCUId]["motor_1_current_v"],
        motor_1_current_w: measurements.boards[PCUId]["motor_1_current_w"],
        motor_2_current_u: measurements.boards[PCUId]["motor_2_current_u"],
        motor_2_current_v: measurements.boards[PCUId]["motor_2_current_v"],
        motor_2_current_w: measurements.boards[PCUId]["motor_2_current_w"],
        motor_1_temp: measurements.boards[PCUId]["motor_1_temp"],
        motor_2_temp: measurements.boards[PCUId]["motor_2_temp"],

        battery_1_voltage: measurements.boards[PCUId]["battery_1_voltage"],
        battery_1_current: measurements.boards[PCUId]["battery_1_current"],
        battery_2_voltage: measurements.boards[PCUId]["battery_2_voltage"],
        battery_2_current: measurements.boards[PCUId]["battery_2_current"],

        temp_1: measurements.boards[PCUId]["temp_1"],
        temp_2: measurements.boards[PCUId]["temp_2"],
        temp_3: measurements.boards[PCUId]["temp_3"],
        temp_4: measurements.boards[PCUId]["temp_4"],
        temp_5: measurements.boards[PCUId]["temp_5"],
        temp_6: measurements.boards[PCUId]["temp_6"],
    } as PCUData;
}
