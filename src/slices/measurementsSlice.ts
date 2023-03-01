import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Measurements } from "./Measurements";
import { PodDataAdapter } from "adapters/PodData";
import { PacketUpdate } from "adapters/PacketUpdate";
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

    for (let board of Object.values(podDataAdapter.boards)) {
        for (let packet of Object.values(board.packets)) {
            for (let measurement of Object.values(packet.measurements)) {
                measurements[measurement.id] = measurement;
            }
        }
    }

    return measurements;
}

export const { initMeasurements, updateMeasurements } =
    measurementsSlice.actions;

export const measurementsReducer = measurementsSlice.reducer;
