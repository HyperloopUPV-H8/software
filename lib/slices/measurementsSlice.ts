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

export type Measurements = {
    measurements: Record<string, Measurement>;
    packetIdToBoard: Record<number, string>;
};

export const measurementsSlice = createSlice({
    name: "measurements",
    initialState: { measurements: {}, packetIdToBoard: {} } as Measurements,
    reducers: {
        initMeasurements: (
            _: Measurements,
            action: PayloadAction<PodDataAdapter>
        ) => {
            return {
                measurements: createMeasurementsFromPodDataAdapter(
                    action.payload
                ),
                packetIdToBoard: getPacketIdToBoard(action.payload),
            };
        },
        updateMeasurements: (
            state: Measurements,
            action: PayloadAction<Record<string, PacketUpdate>>
        ) => {
            for (const update of Object.values(action.payload)) {
                for (const [id, mUpdate] of Object.entries(
                    update.measurementUpdates
                )) {
                    const boardName = state.packetIdToBoard[update.id];

                    if (!boardName) {
                        continue;
                    }

                    const measId = `${boardName}/${id}`;
                    state.measurements[measId].value = mUpdate;
                }
            }
        },
    },
});

function createMeasurementsFromPodDataAdapter(
    podDataAdapter: PodDataAdapter
): Record<string, Measurement> {
    const measurements: Record<string, Measurement> = {};

    for (const board of Object.values(podDataAdapter.boards)) {
        for (const packet of Object.values(board.packets)) {
            for (const adapter of Object.values(packet.measurements)) {
                const id = `${board.name}/${adapter.id}`;
                if (isNumericAdapter(adapter)) {
                    measurements[id] = getNumericMeasurement(id, adapter);
                } else if (adapter.type == "bool") {
                    measurements[id] = getBooleanMeasurement(id, adapter);
                } else {
                    measurements[id] = getEnumMeasurement(id, adapter);
                }
            }
        }
    }

    return measurements;
}

function getPacketIdToBoard(podData: PodDataAdapter) {
    const packetIdToBoard = {} as Record<number, string>;

    for (const board of Object.values(podData.boards)) {
        for (const packet of Object.values(board.packets)) {
            packetIdToBoard[packet.id] = board.name;
        }
    }

    return packetIdToBoard;
}

export function getMeasurement(
    measurements: Measurements,
    id: string
): Measurement | undefined {
    const meas = measurements.measurements[id];

    if (!meas) {
        console.trace(`measurement ${id} not found in store`);
        return undefined;
    }

    return meas;
}
