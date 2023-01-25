import { configureStore } from "@reduxjs/toolkit";
import podDataReducer from "slices/podDataSlice";
import orderReducer from "slices/ordersSlice";
import connectionsReducer from "slices/connectionsSlice";
import messagesReducer from "slices/messagesSlice";

export const store = configureStore({
    reducer: {
        podData: podDataReducer,
        orders: orderReducer,
        connections: connectionsReducer,
        messages: messagesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
