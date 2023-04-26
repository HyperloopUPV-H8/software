import { createMeasurementsSlice } from "common";

export const measurementsSlice = createMeasurementsSlice();

export const { initMeasurements, updateMeasurements } =
    measurementsSlice.actions;

export const measurementsReducer = measurementsSlice.reducer;
