import { Order } from "../models/Order";

export type VcuStateAndOrders = {
    state: string;
    orders: Order[];
};
