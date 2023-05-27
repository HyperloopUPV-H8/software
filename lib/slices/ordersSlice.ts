import { OrderDescription } from "../adapters";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const orderSlice = createSlice({
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
