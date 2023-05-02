import { OrderDescription } from "../adapters/Order";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export function createOrderSlice() {
    return createSlice({
        name: "orders",
        initialState: [] as OrderDescription[],
        reducers: {
            setOrders: (
                _: OrderDescription[],
                action: PayloadAction<OrderDescription[]>
            ) => {
                return action.payload;
            },
        },
    });
}
