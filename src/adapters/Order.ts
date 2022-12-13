export type OrderAdapter = {
  id: number;
  name: string;
  fieldDescriptions: { [name: string]: string };
};

export type OrderDescription = Omit<OrderAdapter, "fieldDescriptions"> & {
  fieldDescriptions: { [name: string]: FieldDescription };
};

export type FieldDescription = { type: string; value: string | Enum };

export type Enum = string[];

export function createEnum(enumExp: string): Enum {
  return enumExp
    .substring(enumExp.indexOf("(") + 1, enumExp.indexOf(")"))
    .split(",");
}
