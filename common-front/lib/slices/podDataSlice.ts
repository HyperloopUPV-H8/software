import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    createPodDataFromAdapter,
    PacketUpdate,
    PodDataAdapter,
} from "../adapters";
import { PodData, updatePodData as updatePackets, Board } from "../models";

export const podDataSlice = createSlice({
    name: "podData",
    initialState: {
        boards: [] as Board[],
        packetToBoard: {} as Record<number, number>,
        lastUpdates: {} as Record<string, PacketUpdate>,
    } as PodData,
    reducers: {
        initPodData: (_: PodData, action: PayloadAction<PodDataAdapter>) => {
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
