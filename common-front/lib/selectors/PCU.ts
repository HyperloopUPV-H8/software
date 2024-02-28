import { Measurements, NumericMeasurement, useMeasurementsStore } from "..";

export type PcuMeasurements = {
    max_ppu_a_temperature: NumericMeasurement;
    max_motor_a_temperature: NumericMeasurement;

    motor_a_current_u: NumericMeasurement;
    motor_a_current_v: NumericMeasurement;
    motor_a_current_w: NumericMeasurement;

    motor_b_current_u: NumericMeasurement;
    motor_b_current_v: NumericMeasurement;
    motor_b_current_w: NumericMeasurement;

    ppu_a_battery_voltage: NumericMeasurement;
    ppu_a_battery_current: NumericMeasurement;

    accel_x: NumericMeasurement;
    accel_y: NumericMeasurement;
    accel_z: NumericMeasurement;

    velocity: NumericMeasurement;
    accel: NumericMeasurement;

    duty_u: NumericMeasurement;
    duty_v: NumericMeasurement;
    duty_w: NumericMeasurement;

    peak_current: NumericMeasurement;
};

export function selectPcuMeasurements(
    measurements: Measurements
): PcuMeasurements {
    
    const getMeasurementFallback = useMeasurementsStore(state => state.getMeasurementFallback);

    return {
        max_ppu_a_temperature: getMeasurementFallback(
            
            "PCU/max_ppu_a_temperature"
        ),
        max_motor_a_temperature: getMeasurementFallback(
            
            "PCU/max_motor_a_temperature"
        ),

        motor_a_current_u: getMeasurementFallback(
            
            "PCU/motor_a_current_u"
        ),
        motor_a_current_v: getMeasurementFallback(
            
            "PCU/motor_a_current_v"
        ),
        motor_a_current_w: getMeasurementFallback(
            
            "PCU/motor_a_current_w"
        ),

        motor_b_current_u: getMeasurementFallback(
            
            "PCU/motor_b_current_u"
        ),
        motor_b_current_v: getMeasurementFallback(
            
            "PCU/motor_b_current_v"
        ),
        motor_b_current_w: getMeasurementFallback(
            
            "PCU/motor_b_current_w"
        ),

        ppu_a_battery_voltage: getMeasurementFallback(
            
            "PCU/ppu_a_battery_voltage"
        ),
        ppu_a_battery_current: getMeasurementFallback(
            
            "PCU/ppu_a_battery_current"
        ),

        accel_x: getMeasurementFallback( "PCU/accel_x"),
        accel_y: getMeasurementFallback( "PCU/accel_y"),
        accel_z: getMeasurementFallback( "PCU/accel_z"),

        velocity: getMeasurementFallback( "PCU/velocity"),
        accel: getMeasurementFallback( "PCU/accel"),

        duty_u: getMeasurementFallback( "PCU/duty_u"),
        duty_v: getMeasurementFallback( "PCU/duty_v"),
        duty_w: getMeasurementFallback( "PCU/duty_w"),

        peak_current: getMeasurementFallback( "PCU/peak_current"),
    } as PcuMeasurements;
}
