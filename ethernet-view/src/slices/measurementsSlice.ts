import { measurementsSlice } from "common";

export const { initMeasurements, updateMeasurements } =
    measurementsSlice.actions;

export const measurementsReducer = measurementsSlice.reducer;
