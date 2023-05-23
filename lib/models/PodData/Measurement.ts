import { NumericType, isNumericType } from "../../BackendTypes";

export type Measurement =
    | NumericMeasurement
    | BooleanMeasurement
    | EnumMeasurement;

type AbstractMeasurement = {
    id: string;
    name: string;
};

export type NumericMeasurement = AbstractMeasurement & {
    type: NumericType;
    value: NumericValue;
    units: string;
    safeRange: [number | null, number | null];
    warningRange: [number | null, number | null];
};

export type NumericValue = { last: number; average: number };

export type BooleanMeasurement = AbstractMeasurement & {
    type: "bool";
    value: boolean;
};

export type EnumMeasurement = AbstractMeasurement & {
    type: "Enum";
    value: string;
};

export type ValueType = number | string | boolean;

export function createNumericMeasurement(
    id: string,
    name: string,
    type: NumericType,
    value: NumericValue,
    safeRange: [number, number],
    warningRange: [number, number],
    units: string
): NumericMeasurement {
    return {
        id,
        name,
        type,
        safeRange,
        warningRange,
        value,
        units,
    };
}

export function isNumericMeasurement(
    measurement: Measurement
): measurement is NumericMeasurement {
    return isNumericType(measurement.type);
}

export function isNumber(type: string) {
    switch (type) {
        case "uint8":
        case "uint16":
        case "uint32":
        case "uint64":
        case "int8":
        case "int16":
        case "int32":
        case "int64":
        case "float32":
        case "float64":
            return true;
        default:
            return false;
    }
}

export function getNumber(type: string, value: string): number {
    switch (type) {
        case "uint8":
        case "uint16":
        case "uint32":
        case "uint64":
        case "int8":
        case "int16":
        case "int32":
        case "int64":
            return Number.parseInt(value);
        case "float32":
        case "float64":
            return Number.parseFloat(value);
        default:
            console.error("Incorrect value type");
            throw "Incorrect value type";
    }
}
