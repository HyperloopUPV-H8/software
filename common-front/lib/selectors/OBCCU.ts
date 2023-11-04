import {
    BooleanMeasurement,
    EnumMeasurement,
    Measurements,
    NumericMeasurement,
    getMeasurementFallback,
} from "..";

export type ObccuMeasurements = {
    generalState: EnumMeasurement;

    maximumCell1: NumericMeasurement;
    maximumCell2: NumericMeasurement;
    maximumCell3: NumericMeasurement;
    maximumCell4: NumericMeasurement;
    maximumCell5: NumericMeasurement;
    maximumCell6: NumericMeasurement;
    maximumCell7: NumericMeasurement;
    maximumCell8: NumericMeasurement;
    maximumCell9: NumericMeasurement;
    maximumCell10: NumericMeasurement;

    minimumCell1: NumericMeasurement;
    minimumCell2: NumericMeasurement;
    minimumCell3: NumericMeasurement;
    minimumCell4: NumericMeasurement;
    minimumCell5: NumericMeasurement;
    minimumCell6: NumericMeasurement;
    minimumCell7: NumericMeasurement;
    minimumCell8: NumericMeasurement;
    minimumCell9: NumericMeasurement;
    minimumCell10: NumericMeasurement;

    SOC1: EnumMeasurement;
    SOC2: EnumMeasurement;
    SOC3: EnumMeasurement;
    SOC4: EnumMeasurement;
    SOC5: EnumMeasurement;
    SOC6: EnumMeasurement;
    SOC7: EnumMeasurement;
    SOC8: EnumMeasurement;
    SOC9: EnumMeasurement;
    SOC10: EnumMeasurement;

    isBalancing1: BooleanMeasurement;
    isBalancing2: BooleanMeasurement;
    isBalancing3: BooleanMeasurement;
    isBalancing4: BooleanMeasurement;
    isBalancing5: BooleanMeasurement;
    isBalancing6: BooleanMeasurement;
    isBalancing7: BooleanMeasurement;
    isBalancing8: BooleanMeasurement;
    isBalancing9: BooleanMeasurement;
    isBalancing10: BooleanMeasurement;

    dclvTemperature: NumericMeasurement;

    battery_temperature_1: NumericMeasurement;
    battery_temperature_2: NumericMeasurement;
    battery_temperature_3: NumericMeasurement;
    battery_temperature_4: NumericMeasurement;
    battery_temperature_5: NumericMeasurement;
    battery_temperature_6: NumericMeasurement;
    battery_temperature_7: NumericMeasurement;
    battery_temperature_8: NumericMeasurement;
    battery_temperature_9: NumericMeasurement;
    battery_temperature_10: NumericMeasurement;

    "2BatteryTemperature1": NumericMeasurement;
    "2BatteryTemperature2": NumericMeasurement;
    "2BatteryTemperature3": NumericMeasurement;
    "2BatteryTemperature4": NumericMeasurement;
    "2BatteryTemperature5": NumericMeasurement;
    "2BatteryTemperature6": NumericMeasurement;
    "2BatteryTemperature7": NumericMeasurement;
    "2BatteryTemperature8": NumericMeasurement;
    "2BatteryTemperature9": NumericMeasurement;
    "2BatteryTemperature10": NumericMeasurement;

    imd: BooleanMeasurement;
    totalVoltage1: NumericMeasurement;
    totalVoltage2: NumericMeasurement;
    totalVoltage3: NumericMeasurement;
    totalVoltage4: NumericMeasurement;
    totalVoltage5: NumericMeasurement;
    totalVoltage6: NumericMeasurement;
    totalVoltage7: NumericMeasurement;
    totalVoltage8: NumericMeasurement;
    totalVoltage9: NumericMeasurement;
    totalVoltage10: NumericMeasurement;

    totalVoltageHigh: NumericMeasurement;
    drift: BooleanMeasurement;
};

export function selectObccuMeasurements(
    measurements: Measurements
): ObccuMeasurements {
    return {
        "2BatteryTemperature1": getMeasurementFallback(
            measurements,
            "OBCCU/2battery_temperature_1"
        ),
        "2BatteryTemperature2": getMeasurementFallback(
            measurements,
            "OBCCU/2battery_temperature_2"
        ),
        "2BatteryTemperature3": getMeasurementFallback(
            measurements,
            "OBCCU/2battery_temperature_3"
        ),
        "2BatteryTemperature4": getMeasurementFallback(
            measurements,
            "OBCCU/2battery_temperature_4"
        ),
        "2BatteryTemperature5": getMeasurementFallback(
            measurements,
            "OBCCU/2battery_temperature_5"
        ),
        "2BatteryTemperature6": getMeasurementFallback(
            measurements,
            "OBCCU/2battery_temperature_6"
        ),
        "2BatteryTemperature7": getMeasurementFallback(
            measurements,
            "OBCCU/2battery_temperature_7"
        ),
        "2BatteryTemperature8": getMeasurementFallback(
            measurements,
            "OBCCU/2battery_temperature_8"
        ),
        "2BatteryTemperature9": getMeasurementFallback(
            measurements,
            "OBCCU/2battery_temperature_9"
        ),
        "2BatteryTemperature10": getMeasurementFallback(
            measurements,
            "OBCCU/2battery_temperature_10"
        ),
        dclvTemperature: getMeasurementFallback(
            measurements,
            "OBCCU/dclv_temperature"
        ),
        generalState: getMeasurementFallback(
            measurements,
            "OBCCU/general_state"
        ),
        imd: getMeasurementFallback(measurements, "OBCCU/imd"),
        isBalancing1: getMeasurementFallback(
            measurements,
            "OBCCU/is_balancing1"
        ),
        isBalancing10: getMeasurementFallback(
            measurements,
            "OBCCU/is_balancing10"
        ),
        isBalancing2: getMeasurementFallback(
            measurements,
            "OBCCU/is_balancing2"
        ),
        isBalancing3: getMeasurementFallback(
            measurements,
            "OBCCU/is_balancing3"
        ),
        isBalancing4: getMeasurementFallback(
            measurements,
            "OBCCU/is_balancing4"
        ),
        isBalancing5: getMeasurementFallback(
            measurements,
            "OBCCU/is_balancing5"
        ),
        isBalancing6: getMeasurementFallback(
            measurements,
            "OBCCU/is_balancing6"
        ),
        isBalancing7: getMeasurementFallback(
            measurements,
            "OBCCU/is_balancing7"
        ),
        isBalancing8: getMeasurementFallback(
            measurements,
            "OBCCU/is_balancing8"
        ),
        isBalancing9: getMeasurementFallback(
            measurements,
            "OBCCU/is_balancing9"
        ),
        maximumCell1: getMeasurementFallback(
            measurements,
            "OBCCU/maximum_cell_1"
        ),
        maximumCell10: getMeasurementFallback(
            measurements,
            "OBCCU/maximum_cell_10"
        ),
        maximumCell2: getMeasurementFallback(
            measurements,
            "OBCCU/maximum_cell_2"
        ),
        maximumCell3: getMeasurementFallback(
            measurements,
            "OBCCU/maximum_cell_3"
        ),
        maximumCell4: getMeasurementFallback(
            measurements,
            "OBCCU/maximum_cell_4"
        ),
        maximumCell5: getMeasurementFallback(
            measurements,
            "OBCCU/maximum_cell_5"
        ),
        maximumCell6: getMeasurementFallback(
            measurements,
            "OBCCU/maximum_cell_6"
        ),
        maximumCell7: getMeasurementFallback(
            measurements,
            "OBCCU/maximum_cell_7"
        ),
        maximumCell8: getMeasurementFallback(
            measurements,
            "OBCCU/maximum_cell_8"
        ),
        maximumCell9: getMeasurementFallback(
            measurements,
            "OBCCU/maximum_cell_9"
        ),
        minimumCell1: getMeasurementFallback(
            measurements,
            "OBCCU/minimum_cell_1"
        ),
        minimumCell10: getMeasurementFallback(
            measurements,
            "OBCCU/minimum_cell_10"
        ),
        minimumCell2: getMeasurementFallback(
            measurements,
            "OBCCU/minimum_cell_2"
        ),
        minimumCell3: getMeasurementFallback(
            measurements,
            "OBCCU/minimum_cell_3"
        ),
        minimumCell4: getMeasurementFallback(
            measurements,
            "OBCCU/minimum_cell_4"
        ),
        minimumCell5: getMeasurementFallback(
            measurements,
            "OBCCU/minimum_cell_5"
        ),
        minimumCell6: getMeasurementFallback(
            measurements,
            "OBCCU/minimum_cell_6"
        ),
        minimumCell7: getMeasurementFallback(
            measurements,
            "OBCCU/minimum_cell_7"
        ),
        minimumCell8: getMeasurementFallback(
            measurements,
            "OBCCU/minimum_cell_8"
        ),
        minimumCell9: getMeasurementFallback(
            measurements,
            "OBCCU/minimum_cell_9"
        ),

        SOC1: getMeasurementFallback(measurements, "OBCCU/SOC1"),
        SOC10: getMeasurementFallback(measurements, "OBCCU/SOC10"),
        SOC2: getMeasurementFallback(measurements, "OBCCU/SOC2"),
        SOC3: getMeasurementFallback(measurements, "OBCCU/SOC3"),
        SOC4: getMeasurementFallback(measurements, "OBCCU/SOC4"),
        SOC5: getMeasurementFallback(measurements, "OBCCU/SOC5"),
        SOC6: getMeasurementFallback(measurements, "OBCCU/SOC6"),
        SOC7: getMeasurementFallback(measurements, "OBCCU/SOC7"),
        SOC8: getMeasurementFallback(measurements, "OBCCU/SOC8"),
        SOC9: getMeasurementFallback(measurements, "OBCCU/SOC9"),

        totalVoltage1: getMeasurementFallback(
            measurements,
            "OBCCU/total_voltage1"
        ),
        totalVoltage10: getMeasurementFallback(
            measurements,
            "OBCCU/total_voltage10"
        ),
        totalVoltage2: getMeasurementFallback(
            measurements,
            "OBCCU/total_voltage2"
        ),
        totalVoltage3: getMeasurementFallback(
            measurements,
            "OBCCU/total_voltage3"
        ),
        totalVoltage4: getMeasurementFallback(
            measurements,
            "OBCCU/total_voltage4"
        ),
        totalVoltage5: getMeasurementFallback(
            measurements,
            "OBCCU/total_voltage5"
        ),
        totalVoltage6: getMeasurementFallback(
            measurements,
            "OBCCU/total_voltage6"
        ),
        totalVoltage7: getMeasurementFallback(
            measurements,
            "OBCCU/total_voltage7"
        ),
        totalVoltage8: getMeasurementFallback(
            measurements,
            "OBCCU/total_voltage8"
        ),
        totalVoltage9: getMeasurementFallback(
            measurements,
            "OBCCU/total_voltage9"
        ),
        totalVoltageHigh: getMeasurementFallback(
            measurements,
            "OBCCU/total_voltage_high"
        ),

        battery_temperature_1: getMeasurementFallback(
            measurements,
            "OBCCU/battery_temperature_1"
        ),
        battery_temperature_2: getMeasurementFallback(
            measurements,
            "OBCCU/battery_temperature_2"
        ),
        battery_temperature_3: getMeasurementFallback(
            measurements,
            "OBCCU/battery_temperature_3"
        ),
        battery_temperature_4: getMeasurementFallback(
            measurements,
            "OBCCU/battery_temperature_4"
        ),
        battery_temperature_5: getMeasurementFallback(
            measurements,
            "OBCCU/battery_temperature_5"
        ),
        battery_temperature_6: getMeasurementFallback(
            measurements,
            "OBCCU/battery_temperature_6"
        ),
        battery_temperature_7: getMeasurementFallback(
            measurements,
            "OBCCU/battery_temperature_7"
        ),
        battery_temperature_8: getMeasurementFallback(
            measurements,
            "OBCCU/battery_temperature_8"
        ),
        battery_temperature_9: getMeasurementFallback(
            measurements,
            "OBCCU/battery_temperature_9"
        ),
        battery_temperature_10: getMeasurementFallback(
            measurements,
            "OBCCU/battery_temperature_10"
        ),
        drift: getMeasurementFallback(
            measurements,
            "OBCCU/drift"
        ),
    } as ObccuMeasurements;
}
