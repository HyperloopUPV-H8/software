import { Order } from "models/Order";

export type StateAndOrders = {
    state: string;
    orders: Order[];
};
