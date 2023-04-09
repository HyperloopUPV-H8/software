import {
    NumericType,
    isSignedIntegerType,
    isUnsignedIntegerType,
} from "adapters/GolangTypes";

export function isNumberValid(
    valueStr: string,
    numberType: NumericType
): boolean {
    return (
        checkNumberString(valueStr, numberType) &&
        ((isUnsignedIntegerType(numberType) &&
            checkUnsignedIntegerOverflow(
                Number.parseInt(valueStr),
                getBits(numberType)
            )) ||
            (isSignedIntegerType(numberType) &&
                checkSignedIntegerOverflow(
                    Number.parseInt(valueStr),
                    getBits(numberType)
                )) ||
            checkFloatOverflow(Number.parseFloat(valueStr)))
    );
}

function checkNumberString(valueStr: string, numberType: NumericType): boolean {
    if (isUnsignedIntegerType(numberType)) {
        return /^\d+$/.test(valueStr);
    } else if (isSignedIntegerType(numberType)) {
        return /^-?\d+$/.test(valueStr);
    } else {
        return /^-?\d+(?:\.\d+)?$/.test(valueStr);
    }
}

function checkUnsignedIntegerOverflow(value: number, bits: number): boolean {
    return value >= 0 && value < 1 << bits;
}

function checkSignedIntegerOverflow(value: number, bits: number): boolean {
    return value >= -1 << (bits - 1) && value < 1 << (bits - 1);
}

function checkFloatOverflow(value: number): boolean {
    return !Number.isNaN(value);
}

function getBits(type: NumericType): number {
    switch (type) {
        case "uint8":
            return 8;
        case "uint16":
            return 16;
        case "uint32":
            return 32;
        case "uint64":
            return 64;
        case "int8":
            return 8;
        case "int16":
            return 16;
        case "int32":
            return 32;
        case "int64":
            return 64;
        case "float32":
            return 32;
        case "float64":
            return 64;
    }
}
