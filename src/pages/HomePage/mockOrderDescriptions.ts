import { OrderDescription } from "@adapters/OrderDescription";
export const mockOrderDescription = [
  {
    id: 1,
    name: "Order 1",
    fieldDescriptions: [
      { name: "isFast", valueType: "boolean" },
      { name: "Position", valueType: "uint8" },
      { name: "Height", valueType: "uint8" },
    ],
  },
  { id: 2, name: "Order 2", fieldDescriptions: [] },
  { id: 3, name: "Order 3", fieldDescriptions: [] },
] as OrderDescription[];
