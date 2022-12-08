export type OrderWebAdapter = {
  id: number;
  name: string;
  fieldDescriptions: { [name: string]: { valueType: string } };
};

export type OrderDescription = OrderWebAdapter & { name: string };
