import type { OrderWebAdapter } from "@adapters/OrderDescription";
import { ValueType } from "@models/PodData/Measurement";

export type OrderField = {
  name: string;
  value: string | number;
  valueType: string;
};

export type Order = {
  id: number;
  fields: OrderField[];
};

export function createOrder(adapter: OrderWebAdapter): Order {
  let newFields = adapter.fieldDescriptions.map((descriptionField) => {
    let value, valueType;

    if (descriptionField.valueType == "Number") {
      value = 0;
      valueType = ValueType.Number;
    } else if (descriptionField.valueType == "Text") {
      value = "";
      valueType = ValueType.Text;
    }

    let field = {
      name: descriptionField.name,
      value,
      valueType,
    };

    assertIsField(field);

    return field;
  });

  return {
    id: adapter.id,
    fields: newFields,
  };
}

function assertIsField(field: unknown): asserts field is OrderField {
  if (field != "Number" || field != "Text") {
    throw new Error("Incorrect value type in OrderWebAdapter");
  }
}
