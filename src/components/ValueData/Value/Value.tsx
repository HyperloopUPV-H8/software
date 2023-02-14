import { VariableType } from "models/PodData/Measurement";

type Props = {
    value: number | string | boolean;
    type: VariableType;
    units: string;
};

function getJSType(type: VariableType) {
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
            return "number";
        case "bool":
            return "boolean";
        default:
            return "string";
    }
}

export const Value = ({ value, type, units }: Props) => {
    const JSType = getJSType(type);

    return (
        <span>
            {`
            ${
                JSType == "number"
                    ? (value as number).toFixed(2)
                    : value.toString()
            } ${JSType == "number" ? units : ""}`}
        </span>
    );
};
