import { NumericType, isSignedIntegerType, isUnsignedIntegerType } from "..";

export function isNumberValid(value: number, numberType: NumericType): boolean {
    if (isUnsignedIntegerType(numberType)) {
        return (
            value % 1 == 0 &&
            checkUnsignedIntegerOverflow(value, getBits(numberType))
        );
    } else if (isSignedIntegerType(numberType)) {
        return (
            value % 1 == 0 &&
            checkSignedIntegerOverflow(value, getBits(numberType))
        );
    } else {
        return checkFloatOverflow(value);
    }
}

function checkUnsignedIntegerOverflow(value: number, bits: number): boolean {
    return value >= 0 && value < 1 << bits; //FIXME: añadir unos
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
