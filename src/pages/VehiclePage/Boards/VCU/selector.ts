import {
    BooleanMeasurement,
    EnumMeasurement,
    Measurements,
    NumericMeasurement,
    getMeasurementFallback,
} from "common";

export type VcuMeasurements = {
    referencePressure: NumericMeasurement;
    actualPressure: NumericMeasurement;
    valveState: BooleanMeasurement;
    reedState: BooleanMeasurement;
    bottleTemp1: NumericMeasurement;
    bottleTemp2: NumericMeasurement;
    highPressure: NumericMeasurement;
    generalState: EnumMeasurement;
    specificState: EnumMeasurement;
    loadState: EnumMeasurement;
    unloadState: EnumMeasurement;
    tractionState: EnumMeasurement;
    dynamicState: EnumMeasurement;
    staticLevState: EnumMeasurement;
};

export function selectVcuMeasurements(
    measurements: Measurements
): VcuMeasurements {
    return {
        actualPressure: getMeasurementFallback(
            measurements,
            "VCU/actualPressure"
        ),
        bottleTemp1: getMeasurementFallback(measurements, "VCU/bottleTemp1"),
        bottleTemp2: getMeasurementFallback(measurements, "VCU/bottleTemp2"),
        highPressure: getMeasurementFallback(measurements, "VCU/highPressure"),
        reedState: getMeasurementFallback(measurements, "VCU/reedState"),
        referencePressure: getMeasurementFallback(
            measurements,
            "VCU/referencePressure"
        ),
        valveState: getMeasurementFallback(measurements, "VCU/valveState"),
        dynamicState: getMeasurementFallback(measurements, "VCU/dynamicState"),
        generalState: getMeasurementFallback(measurements, "VCU/generalState"),
        loadState: getMeasurementFallback(measurements, "VCU/loadState"),
        specificState: getMeasurementFallback(
            measurements,
            "VCU/specificState"
        ),
        staticLevState: getMeasurementFallback(
            measurements,
            "VCU/staticLevState"
        ),
        tractionState: getMeasurementFallback(
            measurements,
            "VCU/tractionState"
        ),
        unloadState: getMeasurementFallback(measurements, "VCU/unloadState"),
    } as VcuMeasurements;
}
