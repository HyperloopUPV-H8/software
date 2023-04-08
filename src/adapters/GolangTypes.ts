export type GolangTypes =
    | SignedIntegerType
    | UnsignedIntegerType
    | FloatingType
    | Bool
    | Enum;

export type SignedIntegerType = "int8" | "int16" | "int32" | "int64";

export type UnsignedIntegerType = "uint8" | "uint16" | "uint32" | "uint64";

export type FloatingType = "float32" | "float64";

export type NumericType =
    | SignedIntegerType
    | UnsignedIntegerType
    | FloatingType;

export function isNumericType(
    type: string
): type is SignedIntegerType | UnsignedIntegerType | FloatingType {
    return (
        type == "int8" ||
        type == "int16" ||
        type == "int32" ||
        type == "int64" ||
        type == "uint8" ||
        type == "uint16" ||
        type == "uint32" ||
        type == "uint64" ||
        type == "float32" ||
        type == "float64"
    );
}

export function isUnsignedIntegerType(
    type: NumericType
): type is UnsignedIntegerType {
    return (
        type == "uint8" ||
        type == "uint16" ||
        type == "uint32" ||
        type == "uint64"
    );
}

export function isSignedIntegerType(
    type: NumericType
): type is SignedIntegerType {
    return (
        type == "int8" || type == "int16" || type == "int32" || type == "int64"
    );
}

export function isFloatingType(type: NumericType): type is FloatingType {
    return type == "float32" || type == "float64";
}

type Enum = "Enum";
type Bool = "bool";
