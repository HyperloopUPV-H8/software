import type {
  OrderDescription,
  OrderWebAdapter,
} from "@adapters/OrderDescription";
import { ValueType } from "@models/PodData/Measurement";

export type Order = {
  id: number;
  fields: OrderField[];
};

export type OrderField = {
  name: string;
  value: string | number | boolean;
};

export function createOrderDescription(
  adapter: OrderWebAdapter
): OrderDescription {
  let newFields = adapter.fieldDescriptions.map((descriptionField) => {
    return {
      name: descriptionField.name,
      value: 0,
      valueType: descriptionField.valueType,
    };
  });

  return {
    id: adapter.id,
    name: adapter.name,
    fieldDescriptions: newFields,
  };
}
