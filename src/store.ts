import { configureStore } from "@reduxjs/toolkit";
import { measurementsReducer } from "slices/measurementsSlice";
import { podDataReducer } from "slices/podDataSlice";
export const store = configureStore({
    reducer: {
        podData: podDataReducer,
        measurements: measurementsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
