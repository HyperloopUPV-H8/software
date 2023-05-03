import { Measurements } from "common";
import { PCUData } from "./PCUData";

export function extractPCUData(measurements: Measurements): PCUData {
    return {
        velocity: measurements["velocity"],
        vel_x: measurements["vel_x"],
        vel_y: measurements["vel_y"],
        vel_z: measurements["vel_z"],
        acceleration: measurements["acceleration"],
        acc_x: measurements["acc_x"],
        acc_y: measurements["acc_y"],
        acc_z: measurements["acc_z"],

        motor_1_current_u: measurements["motor_1_current_u"],
        motor_1_current_v: measurements["motor_1_current_v"],
        motor_1_current_w: measurements["motor_1_current_w"],
        motor_2_current_u: measurements["motor_2_current_u"],
        motor_2_current_v: measurements["motor_2_current_v"],
        motor_2_current_w: measurements["motor_2_current_w"],
        motor_1_temp: measurements["motor_1_temp"],
        motor_2_temp: measurements["motor_2_temp"],

        battery_1_voltage: measurements["battery_1_voltage"],
        battery_1_current: measurements["battery_1_current"],
        battery_2_voltage: measurements["battery_2_voltage"],
        battery_2_current: measurements["battery_2_current"],

        temp_1: measurements["temp_1"],
        temp_2: measurements["temp_2"],
        temp_3: measurements["temp_3"],
        temp_4: measurements["temp_4"],
        temp_5: measurements["temp_5"],
        temp_6: measurements["temp_6"],
    } as PCUData;
}
