import {
    BooleanMeasurement,
    Measurements,
    NumericMeasurement,
    getMeasurementFallback,
} from "..";

export type BmslMeasurements = {
    av_current: NumericMeasurement;

    low_cell1: NumericMeasurement;
    low_cell2: NumericMeasurement;
    low_cell3: NumericMeasurement;
    low_cell4: NumericMeasurement;
    low_cell5: NumericMeasurement;
    low_cell6: NumericMeasurement;

    low_SOC1: NumericMeasurement;
    low_is_balancing1: NumericMeasurement;
    low_maximum_cell: NumericMeasurement;
    low_minimum_cell: NumericMeasurement;
    low_battery_temperature_1: NumericMeasurement;
    low_battery_temperature_2: NumericMeasurement;

    total_voltage_low: NumericMeasurement;

    input_charging_current: NumericMeasurement;
    output_charging_current: NumericMeasurement;
    input_charging_voltage: NumericMeasurement;
    output_charging_voltage: NumericMeasurement;
    pwm_frequency: NumericMeasurement;

    conditions_ready: BooleanMeasurement;
    conditions_want_to_charge: BooleanMeasurement;
    conditions_charging: BooleanMeasurement;
    conditions_fault: BooleanMeasurement;
};

export function selectBmslMeasurements(
    measurements: Measurements
): BmslMeasurements {
    return {
        av_current: getMeasurementFallback(measurements, "BMSL/av_current"),

        low_cell1: getMeasurementFallback(measurements, "BMSL/low_cell1"),
        low_cell2: getMeasurementFallback(measurements, "BMSL/low_cell2"),
        low_cell3: getMeasurementFallback(measurements, "BMSL/low_cell3"),
        low_cell4: getMeasurementFallback(measurements, "BMSL/low_cell4"),
        low_cell5: getMeasurementFallback(measurements, "BMSL/low_cell5"),
        low_cell6: getMeasurementFallback(measurements, "BMSL/low_cell6"),

        low_SOC1: getMeasurementFallback(measurements, "BMSL/low_SOC1"),
        low_is_balancing1: getMeasurementFallback(
            measurements,
            "BMSL/low_is_balancing1"
        ),
        low_maximum_cell: getMeasurementFallback(
            measurements,
            "BMSL/low_maximum_cell"
        ),
        low_minimum_cell: getMeasurementFallback(
            measurements,
            "BMSL/low_minimum_cell"
        ),
        low_battery_temperature_1: getMeasurementFallback(
            measurements,
            "BMSL/low_battery_temperature_1"
        ),
        low_battery_temperature_2: getMeasurementFallback(
            measurements,
            "BMSL/low_battery_temperature_2"
        ),
        total_voltage_low: getMeasurementFallback(
            measurements,
            "BMSL/total_voltage_low"
        ),
        input_charging_current: getMeasurementFallback(
            measurements,
            "BMSL/input_charging_current"
        ),
        output_charging_current: getMeasurementFallback(
            measurements,
            "BMSL/output_charging_current"
        ),
        input_charging_voltage: getMeasurementFallback(
            measurements,
            "BMSL/output_charging_current"
        ),

        output_charging_voltage: getMeasurementFallback(
            measurements,
            "BMSL/output_charging_voltage"
        ),

        pwm_frequency: getMeasurementFallback(
            measurements,
            "BMSL/pwm_frequency"
        ),

        conditions_ready: getMeasurementFallback(
            measurements,
            "BMSL/conditions_ready"
        ),
        conditions_want_to_charge: getMeasurementFallback(
            measurements,
            "BMSL/conditions_want_to_charge"
        ),
        conditions_charging: getMeasurementFallback(
            measurements,
            "BMSL/conditions_charging"
        ),
        conditions_fault: getMeasurementFallback(
            measurements,
            "BMSL/conditions_fault"
        ),
    } as BmslMeasurements;
}
