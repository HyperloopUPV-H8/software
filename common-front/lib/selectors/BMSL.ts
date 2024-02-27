import {
    BooleanMeasurement,
    Measurements,
    NumericMeasurement,
    useMeasurementsStore
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
    
    const getMeasurementFallback = useMeasurementsStore(state => state.getMeasurementFallback);

    return {
        av_current: getMeasurementFallback("BMSL/av_current"),

        low_cell1: getMeasurementFallback("BMSL/low_cell1"),
        low_cell2: getMeasurementFallback("BMSL/low_cell2"),
        low_cell3: getMeasurementFallback("BMSL/low_cell3"),
        low_cell4: getMeasurementFallback("BMSL/low_cell4"),
        low_cell5: getMeasurementFallback("BMSL/low_cell5"),
        low_cell6: getMeasurementFallback("BMSL/low_cell6"),

        low_SOC1: getMeasurementFallback("BMSL/low_SOC1"),
        low_is_balancing1: getMeasurementFallback("BMSL/low_is_balancing1"),
        low_maximum_cell: getMeasurementFallback(
            "BMSL/low_maximum_cell"
        ),
        low_minimum_cell: getMeasurementFallback(
            "BMSL/low_minimum_cell"
        ),
        low_battery_temperature_1: getMeasurementFallback(
            "BMSL/low_battery_temperature_1"
        ),
        low_battery_temperature_2: getMeasurementFallback(
            "BMSL/low_battery_temperature_2"
        ),
        total_voltage_low: getMeasurementFallback(
            "BMSL/total_voltage_low"
        ),
        input_charging_current: getMeasurementFallback(
            "BMSL/input_charging_current"
        ),
        output_charging_current: getMeasurementFallback(
            "BMSL/output_charging_current"
        ),
        input_charging_voltage: getMeasurementFallback(
            "BMSL/output_charging_current"
        ),

        output_charging_voltage: getMeasurementFallback(
            "BMSL/output_charging_voltage"
        ),

        pwm_frequency: getMeasurementFallback(
            "BMSL/pwm_frequency"
        ),

        conditions_ready: getMeasurementFallback(
            "BMSL/conditions_ready"
        ),
        conditions_want_to_charge: getMeasurementFallback(
            "BMSL/conditions_want_to_charge"
        ),
        conditions_charging: getMeasurementFallback(
            "BMSL/conditions_charging"
        ),
        conditions_fault: getMeasurementFallback(
            "BMSL/conditions_fault"
        ),
    } as BmslMeasurements;
}
