import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createPodDataFromAdapter } from "adapters/PodData";
import { updatePodData as updatePackets } from "models/PodData/PodData";
import { PacketUpdate } from "adapters/PacketUpdate";
import { PodDataAdapter } from "adapters/PodData";
import { PodData } from "models/PodData/PodData";
import { RootState } from "store";
import { TreeNode } from "components/ChartMenu/Sidebar/TreeNode";
import { Packet } from "models/PodData/Packet";
import { Board } from "models/PodData/Board";
import { isNumber } from "models/PodData/Measurement";

export const podDataSlice = createSlice({
    name: "podData",
    initialState: {
        boards: {},
        packetToBoard: {},
        lastUpdates: {},
    } as PodData,
    reducers: {
        initPodData: (_, action: PayloadAction<PodDataAdapter>) => {
            return createPodDataFromAdapter(action.payload);
        },
        updatePodData: (
            podData,
            action: PayloadAction<{ [id: number]: PacketUpdate }>
        ) => {
            podData.lastUpdates = action.payload;
            updatePackets(podData, action.payload);
        },
    },
});

export const { initPodData, updatePodData } = podDataSlice.actions;

export default podDataSlice.reducer;

export function selectNumericPodDataNames(state: RootState): TreeNode {
    let boards = {};
    Object.values(state.podData.boards).forEach((board) => {
        let packets = getNumericPacketNames(board);
        if (packets) {
            Object.assign(boards, { [board.name]: packets });
        }
    });

    return boards;
}

function getNumericPacketNames(board: Board): TreeNode | undefined {
    let packets = {};

    Object.values(board.packets).forEach((packet) => {
        let measurements = getNumericMeasurementNames(packet);
        if (measurements) {
            Object.assign(packets, { [packet.name]: measurements });
        }
    });

    if (Object.entries(packets).length > 0) {
        return packets;
    } else {
        return undefined;
    }
}

function getNumericMeasurementNames(packet: Packet): TreeNode | undefined {
    let measurements = {} as TreeNode;
    Object.values(packet.measurements).forEach((measurement) => {
        if (isNumber(measurement.type)) {
            Object.assign(measurements, { [measurement.id]: undefined });
        }
    });

    if (Object.entries(measurements).length > 0) {
        return measurements;
    } else {
        return undefined;
    }
}
