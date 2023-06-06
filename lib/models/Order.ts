import { OrderDescription } from "..";

export type Order = {
    id: number;
    fields: Record<string, OrderField>;
};

type OrderField = {
    value: string | number | boolean;
    isEnabled: boolean;
};

export type VehicleOrders = {
    boards: BoardOrders[];
};

export type BoardOrders = {
    name: string;
    orders: OrderDescription[];
    stateOrders: (OrderDescription & { enabled: boolean })[];
};

export type StateOrdersUpdate = Record<string, number[]>;
