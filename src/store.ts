import { configureStore } from "@reduxjs/toolkit";
import { measurementsReducer } from "slices/measurementsSlice";
export const store = configureStore({
    reducer: {
        measurements: measurementsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
