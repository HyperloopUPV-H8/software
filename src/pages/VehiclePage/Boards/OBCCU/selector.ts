import {
    BooleanMeasurement,
    EnumMeasurement,
    Measurements,
    NumericMeasurement,
    getMeasurementFallback,
} from "common";

export type ObccuMeasurements = {
    generalState: EnumMeasurement;
    batteryTemperature: NumericMeasurement;

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

    capacitorTemperature: NumericMeasurement;
    inverterTemperature: NumericMeasurement;
    rectifierTemperature: NumericMeasurement;
    transformerTemperature: NumericMeasurement;

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
    totalVoltage5: NumericMeasurement;
    totalVoltage6: NumericMeasurement;
    totalVoltage7: NumericMeasurement;
    totalVoltage8: NumericMeasurement;
    totalVoltage9: NumericMeasurement;
    totalVoltage10: NumericMeasurement;

    totalVoltageHigh: NumericMeasurement;
};

export function selectObccuMeasurements(
    measurements: Measurements
): ObccuMeasurements {
    return {
        "2BatteryTemperature1": getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        "2BatteryTemperature2": getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        "2BatteryTemperature3": getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        "2BatteryTemperature4": getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        "2BatteryTemperature5": getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        "2BatteryTemperature6": getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        "2BatteryTemperature7": getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        "2BatteryTemperature8": getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        "2BatteryTemperature9": getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        "2BatteryTemperature10": getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        batteryTemperature: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        capacitorTemperature: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        generalState: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        imd: getMeasurementFallback(measurements, "OBCCU/2BatteryTemperature1"),
        inverterTemperature: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        isBalancing1: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        isBalancing10: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        isBalancing2: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        isBalancing3: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        isBalancing4: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        isBalancing5: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        isBalancing6: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        isBalancing7: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        isBalancing8: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        isBalancing9: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        maximumCell1: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        maximumCell10: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        maximumCell2: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        maximumCell3: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        maximumCell4: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        maximumCell5: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        maximumCell6: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        maximumCell7: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        maximumCell8: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        maximumCell9: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        minimumCell1: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        minimumCell10: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        minimumCell2: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        minimumCell3: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        minimumCell4: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        minimumCell5: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        minimumCell6: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        minimumCell7: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        minimumCell8: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        minimumCell9: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        rectifierTemperature: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        SOC1: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        SOC10: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        SOC2: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        SOC3: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        SOC4: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        SOC5: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        SOC6: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        SOC7: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        SOC8: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        SOC9: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        totalVoltage1: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        totalVoltage10: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        totalVoltage2: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        totalVoltage3: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        totalVoltage5: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        totalVoltage6: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        totalVoltage7: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        totalVoltage8: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        totalVoltage9: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        totalVoltageHigh: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
        transformerTemperature: getMeasurementFallback(
            measurements,
            "OBCCU/2BatteryTemperature1"
        ),
    } as ObccuMeasurements;
}
