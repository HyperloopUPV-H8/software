import { Order } from "models/Order";

export type StateAndOrders = {
    state: string;
    actions: Order[];
};
