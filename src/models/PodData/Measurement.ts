export enum ValueType {
  Number = "Number",
  Text = "Text",
}

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
