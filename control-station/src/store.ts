import messagesReducer from "slices/messagesSlice";
import orderReducer from "slices/ordersSlice";
import connectionsSlice from "slices/connectionsSlice";

import { configureStore } from "@reduxjs/toolkit";
import { measurementsReducer } from "slices/measurementsSlice";
export const store = configureStore({
    reducer: {
        measurements: measurementsReducer,
        messages: messagesReducer,
        orders: orderReducer,
        connections: connectionsSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
