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

type BoardId = string;
type MeasurementId = string;
export type Measurements = {
    boards: Record<BoardId, Record<MeasurementId, Measurement>>;
    packetIdToBoardId: Record<string, string>;
};

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
            for (let update of Object.values(action.payload)) {
                for (let [id, mUpdate] of Object.entries(
                    update.measurementUpdates
                )) {
                    const boardId = state.packetIdToBoardId[update.id];

                    if (!boardId) {
                        console.error(
                            `packet ${update.id} not found in packetIdToBoardId`
                        );
                    }

                    const board = state.boards[boardId];

                    if (!board) {
                        console.error(`board ${boardId} not found`);
                    }

                    board[id].value = mUpdate;
                }
            }
        },
    },
});

function createMeasurementsFromPodDataAdapter(
    podDataAdapter: PodDataAdapter
): Measurements {
    const measurements: Measurements = { boards: {}, packetIdToBoardId: {} };

    for (const board of Object.values(podDataAdapter.boards)) {
        for (const packet of Object.values(board.packets)) {
            for (const adapter of Object.values(packet.measurements)) {
                if (!measurements.boards[board.name]) {
                    measurements.boards[board.name] = {};
                }

                measurements.packetIdToBoardId[packet.id] = board.name;

                if (isNumericAdapter(adapter)) {
                    measurements.boards[board.name][adapter.id] =
                        getNumericMeasurement(adapter);
                } else if (adapter.type == "bool") {
                    measurements.boards[board.name][adapter.id] =
                        getBooleanMeasurement(adapter);
                } else if (adapter.type == "enum") {
                    measurements.boards[board.name][adapter.id] =
                        getEnumMeasurement(adapter);
                }
            }
        }
    }

    return measurements;
}

export function getMeasurement(
    measurements: Measurements,
    boardId: string,
    measId: string
): Measurement | undefined {
    const board = measurements.boards[boardId];

    if (!board) {
        console.trace(`board ${board} not found in store`);
        return undefined;
    }

    const meas = board[measId];

    if (!meas) {
        console.trace(`measurement ${measId} not found in store`);
        return undefined;
    }

    return meas;
}
