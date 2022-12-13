import type { OrderDescription, OrderAdapter } from "@adapters/Order";
import { ValueType } from "@models/PodData/Measurement";

export type Order = {
  id: number;
  fields: { [name: string]: string | number | boolean };
};
