import { Order } from "common";
import { createContext, useContext } from "react";

export const OrderContext = createContext((order: Order) => {});
