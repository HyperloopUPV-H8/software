import { Measurement } from "models/PodData/Measurement";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PodDataAdapter } from "adapters/PodData";
import { PacketUpdate } from "adapters/PacketUpdate";

export type Measurements = { [name: string]: Measurement };

export const measurementsSlice = createSlice({
    name: "measurements",
    initialState: {} as Measurements,
    reducers: {
        initMeasurements: (_, action: PayloadAction<PodDataAdapter>) => {
            return createMeasurementMapFromPodDataAdapter(action.payload);
        },
        updateMeasurements: (
            state,
            action: PayloadAction<Record<string, PacketUpdate>>
        ) => {
            for (let packetUpdate of Object.values(action.payload)) {
                for (let [id, mUpdate] of Object.entries(
                    packetUpdate.measurementUpdates
                ))
                    state[id].value = mUpdate;
            }
        },
    },
});

function createMeasurementMapFromPodDataAdapter(
    podDataAdapter: PodDataAdapter
): Measurements {
    const measurements = {} as Measurements;

    for (const board of Object.values(podDataAdapter.boards)) {
        for (const packet of Object.values(board.packets)) {
            for (const measurement of Object.values(packet.measurements)) {
                measurements[measurement.id] = {
                    ...measurement,
                    safeRange: transformRange(measurement.safeRange),
                    warningRange: transformRange(measurement.warningRange),
                };
            }
        }
    }

    return measurements;
}

function transformRange(
    range: [number | null, number | null]
): [number, number] {
    const lowerBound = range[0] ?? -Infinity;
    const upperBound = range[1] ?? Infinity;

    return [lowerBound, upperBound];
}

export const { initMeasurements, updateMeasurements } =
    measurementsSlice.actions;

export const measurementsReducer = measurementsSlice.reducer;
