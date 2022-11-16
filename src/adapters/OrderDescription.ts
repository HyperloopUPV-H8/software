import { Order } from "@models/Order";

export type OrderDescription = {
  id: number;
  fields: { name: string; valueType: string }[];
};
