import { NumericType, isSignedIntegerType, isUnsignedIntegerType } from ".";

function isStringNumber(valueStr: string, numberType: NumericType): boolean {
    if (isUnsignedIntegerType(numberType)) {
        return /^\d+$/.test(valueStr);
    } else if (isSignedIntegerType(numberType)) {
        return /^-?\d+$/.test(valueStr);
    } else {
        return /^-?\d+(?:\.\d+)?$/.test(valueStr);
    }
}

export function doesNumberOverflow(v: number, type: NumericType): boolean {
    const bits = typeToBits[type];

    if (isUnsignedIntegerType(type)) {
        return unsignedIntegerOverflows(v, bits);
    } else if (isSignedIntegerType(type)) {
        return signedIntegerOverflows(v, bits);
    } else {
        return floatOverflows(v);
    }
}

export function isNumberValid(valueStr: string, type: NumericType): boolean {
    if (isStringNumber(valueStr, type)) {
        const value = parseFloat(valueStr);
        return doesNumberOverflow(value, type);
    }

    return false;
}

function unsignedIntegerOverflows(value: number, bits: number): boolean {
    return value >= 0 && value < 1 << bits; //FIXME: añadir unos
}

function signedIntegerOverflows(value: number, bits: number): boolean {
    return value >= -1 << (bits - 1) && value < 1 << (bits - 1);
}

function floatOverflows(value: number): boolean {
    return !Number.isNaN(value);
}

export function isWithinRange(
    v: number,
    range: [number | null, number | null]
) {
    let isWithinRange = true;
    if (range[0] !== null) {
        isWithinRange &&= v >= range[0];
    }

    if (range[1] !== null) {
        isWithinRange &&= v <= range[1];
    }

    return isWithinRange;
}

const typeToBits: Record<NumericType, number> = {
    uint8: 8,
    uint16: 16,
    uint32: 32,
    uint64: 64,
    int8: 8,
    int16: 16,
    int32: 32,
    int64: 64,
    float32: 32,
    float64: 64,
};
