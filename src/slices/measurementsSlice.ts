import {
    isNumericMeasurement,
    Measurement,
    NumericValue,
} from "models/PodData/Measurement";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    getBooleanMeasurement,
    getEnumMeasurement,
    getNumericMeasurement,
    isNumericAdapter,
    PodDataAdapter,
} from "adapters/PodData";
import { PacketUpdate } from "adapters/PacketUpdate";
import { isNumericType } from "BackendTypes";

export type Measurements = { [name: string]: Measurement };

export const measurementsSlice = createSlice({
    name: "measurements",
    initialState: {} as Measurements,
    reducers: {
        initMeasurements: (_, action: PayloadAction<PodDataAdapter>) => {
            return createMeasurementsFromPodDataAdapter(action.payload);
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

function createMeasurementsFromPodDataAdapter(
    podDataAdapter: PodDataAdapter
): Measurements {
    const measurements: Measurements = {};

    for (const board of Object.values(podDataAdapter.boards)) {
        for (const packet of Object.values(board.packets)) {
            for (const adapter of Object.values(packet.measurements)) {
                if (isNumericAdapter(adapter)) {
                    measurements[adapter.id] = getNumericMeasurement(adapter);
                } else if (adapter.type == "bool") {
                    measurements[adapter.id] = getBooleanMeasurement(adapter);
                } else if (adapter.type == "Enum") {
                    measurements[adapter.id] = getEnumMeasurement(adapter);
                }
            }
        }
    }

    return measurements;
}

export function transformRange(
    range: [number | null, number | null]
): [number, number] {
    const lowerBound = range[0] ?? -Infinity;
    const upperBound = range[1] ?? Infinity;

    return [lowerBound, upperBound];
}

export const { initMeasurements, updateMeasurements } =
    measurementsSlice.actions;

export const measurementsReducer = measurementsSlice.reducer;
