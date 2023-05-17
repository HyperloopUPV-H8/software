import { Measurement } from "models/PodData/Measurement";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    getBooleanMeasurement,
    getEnumMeasurement,
    getNumericMeasurement,
    isNumericAdapter,
    PodDataAdapter,
} from "../adapters/PodData";
import { PacketUpdate } from "../adapters/PacketUpdate";

export type Measurements = Record<string, Measurement>;

export function createMeasurementsSlice() {
    return createSlice({
        name: "measurements",
        initialState: {} as Measurements,
        reducers: {
            initMeasurements: (
                _: Measurements,
                action: PayloadAction<PodDataAdapter>
            ) => {
                return createMeasurementsFromPodDataAdapter(action.payload);
            },
            updateMeasurements: (
                state: Measurements,
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
}

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
