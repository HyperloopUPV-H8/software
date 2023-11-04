import { StateOrdersUpdate, VehicleOrders } from "..";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const orderSlice = createSlice({
    name: "orders",
    initialState: {
        boards: [],
    } as VehicleOrders,
    reducers: {
        setOrders: (_, action: PayloadAction<VehicleOrders>) => {
            return action.payload;
        },
        updateStateOrders: (
            state,
            action: PayloadAction<StateOrdersUpdate>
        ) => {
            Object.entries(action.payload).forEach(([name, ids]) => {
                const index = state.boards.findIndex(
                    (board) => board.name == name
                );

                if (index == -1) {
                    return;
                }

                state.boards[index].stateOrders = state.boards[
                    index
                ].stateOrders.map((item) => {
                    return {
                        ...item,
                        enabled: ids.includes(item.id),
                    };
                });
            });
        },
    },
});
