type EnumType = `Enum(${string})`;

export type ValueType =
  | "uint8"
  | "uint16"
  | "uint32"
  | "uint64"
  | "int8"
  | "int16"
  | "int32"
  | "int64"
  | "float32"
  | "float64"
  | "bool"
  | EnumType;

export type Measurement = {
  name: string;
  type: ValueType;
  value: string | number;
  units: string;
};

export function createMeasurement(
  name: string,
  type: ValueType,
  value: string | number,
  units: string
) {
  return {
    name,
    type,
    value,
    units,
  };
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
      break;
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
      throw "Incorrect value type";
  }
}
