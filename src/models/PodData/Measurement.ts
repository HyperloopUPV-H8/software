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
