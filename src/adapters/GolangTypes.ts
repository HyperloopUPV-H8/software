export type GolangTypes = IntegerTypes | FloatingTypes | Bool | Enum;

type IntegerTypes =
    | "int8"
    | "int16"
    | "int32"
    | "int64"
    | "uint8"
    | "uint16"
    | "uint32"
    | "uint64";

type FloatingTypes = "float32" | "float64";

export type NumericType = IntegerTypes | FloatingTypes;

export function typeIsNumeric(
    type: string
): type is IntegerTypes | FloatingTypes {
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

type Enum = "Enum";
type Bool = "bool";
