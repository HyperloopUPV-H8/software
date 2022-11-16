import { configureStore } from "@reduxjs/toolkit";
import podDataReducer from "@slices/podDataSlice";
import orderReducer from "@slices/ordersSlice";

export const store = configureStore({
  reducer: {
    podData: podDataReducer,
    orders: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
