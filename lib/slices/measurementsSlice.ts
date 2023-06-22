import { Measurement } from "../models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    getBooleanMeasurement,
    getEnumMeasurement,
    getNumericMeasurement,
    isNumericAdapter,
    PodDataAdapter,
    PacketUpdate,
} from "../adapters";

export type Measurements = Record<string, Measurement>;

export const measurementsSlice = createSlice({
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
            for (const update of Object.values(action.payload)) {
                for (const [id, mUpdate] of Object.entries(
                    update.measurementUpdates
                )) {
                    state[id].value = mUpdate;
                }
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
                const id = `${board.name}/${adapter.id}`;
                if (isNumericAdapter(adapter)) {
                    measurements[id] = getNumericMeasurement(adapter);
                } else if (adapter.type == "bool") {
                    measurements[id] = getBooleanMeasurement(adapter);
                } else {
                    measurements[id] = getEnumMeasurement(adapter);
                }
            }
        }
    }

    return measurements;
}

export function getMeasurement(
    measurements: Measurements,
    id: string
): Measurement | undefined {
    const meas = measurements[id];

    if (!meas) {
        console.trace(`measurement ${id} not found in store`);
        return undefined;
    }

    return meas;
}
