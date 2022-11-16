import { configureStore } from "@reduxjs/toolkit";
import podDataReducer from "@slices/podDataSlice";
import orderReducer from "@slices/ordersSlice";
import connectionsReducer from "@slices/connectionsSlice";

export const store = configureStore({
  reducer: {
    podData: podDataReducer,
    orders: orderReducer,
    connections: connectionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
