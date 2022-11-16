export enum ValueType {
  Number,
  Text,
}

export class Measurement {
  name: string;
  type: ValueType;
  value: string | number;
  units: string;

  constructor(
    name: string,
    type: ValueType,
    value: string | number,
    units: string
  ) {
    this.name = name;
    this.type = type;
    this.value = value;
    this.units = units;
  }
}
