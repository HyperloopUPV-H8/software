import {
    Measurements,
    NumericMeasurement,
    getMeasurementFallback,
} from "common";

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
        velocity: getMeasurementFallback(measurements, "PCU/velocity"),
        vel_x: getMeasurementFallback(measurements, "PCU/vel_x"),
        vel_y: getMeasurementFallback(measurements, "PCU/vel_y"),
        vel_z: getMeasurementFallback(measurements, "PCU/vel_z"),
        acceleration: getMeasurementFallback(measurements, "PCU/acceleration"),
        acc_x: getMeasurementFallback(measurements, "PCU/acc_x"),
        acc_y: getMeasurementFallback(measurements, "PCU/acc_y"),
        acc_z: getMeasurementFallback(measurements, "PCU/acc_z"),

        motor_1_current_u: getMeasurementFallback(
            measurements,
            "PCU/motor_1_current_u"
        ),
        motor_1_current_v: getMeasurementFallback(
            measurements,
            "PCU/motor_1_current_v"
        ),
        motor_1_current_w: getMeasurementFallback(
            measurements,
            "PCU/motor_1_current_w"
        ),
        motor_2_current_u: getMeasurementFallback(
            measurements,
            "PCU/motor_2_current_u"
        ),
        motor_2_current_v: getMeasurementFallback(
            measurements,
            "PCU/motor_2_current_v"
        ),
        motor_2_current_w: getMeasurementFallback(
            measurements,
            "PCU/motor_2_current_w"
        ),
        motor_1_temp: getMeasurementFallback(measurements, "PCU/motor_1_temp"),
        motor_2_temp: getMeasurementFallback(measurements, "PCU/motor_2_temp"),

        battery_1_voltage: getMeasurementFallback(
            measurements,
            "PCU/battery_1_voltage"
        ),
        battery_1_current: getMeasurementFallback(
            measurements,
            "PCU/battery_1_current"
        ),
        battery_2_voltage: getMeasurementFallback(
            measurements,
            "PCU/battery_2_voltage"
        ),
        battery_2_current: getMeasurementFallback(
            measurements,
            "PCU/battery_2_current"
        ),

        temp_1: getMeasurementFallback(measurements, "PCU/temp_1"),
        temp_2: getMeasurementFallback(measurements, "PCU/temp_2"),
        temp_3: getMeasurementFallback(measurements, "PCU/temp_3"),
        temp_4: getMeasurementFallback(measurements, "PCU/temp_4"),
        temp_5: getMeasurementFallback(measurements, "PCU/temp_5"),
        temp_6: getMeasurementFallback(measurements, "PCU/temp_6"),
    } as PcuMeasurements;
}
