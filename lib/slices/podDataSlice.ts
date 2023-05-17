import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createPodDataFromAdapter } from "adapters/PodData";
import { PacketUpdate } from "adapters/PacketUpdate";
import { PodDataAdapter } from "adapters/PodData";
import { PodData } from "models";
import { updatePodData as updatePackets } from "models/PodData/PodData";
import { Board } from "models";

export function createPodDataSlice() {
    return createSlice({
        name: "podData",
        initialState: {
            boards: [] as Board[],
            packetToBoard: {} as Record<number, number>,
            lastUpdates: {} as Record<string, PacketUpdate>,
        } as PodData,
        reducers: {
            initPodData: (
                _: PodData,
                action: PayloadAction<PodDataAdapter>
            ) => {
                return createPodDataFromAdapter(action.payload);
            },
            updatePodData: (
                state: PodData,
                action: PayloadAction<Record<number, PacketUpdate>>
            ) => {
                state.lastUpdates = action.payload;
                updatePackets(state, action.payload);
            },
        },
    });
}
