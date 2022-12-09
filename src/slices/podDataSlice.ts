import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createPodDataFromAdapter } from "@adapters/PodData";
import { updatePodData as updatePackets } from "@models/PodData/PodData";
import { PacketUpdate } from "@adapters/PacketUpdate";
import { PodDataAdapter } from "@adapters/PodData";
import { PodData } from "@models/PodData/PodData";
import { RootState } from "store";
import { TreeNode } from "@components/ChartMenu/TreeNode";

export const podDataSlice = createSlice({
  name: "podData",
  initialState: {
    boards: {},
    packetToBoard: {},
    lastUpdates: {},
  } as PodData,
  reducers: {
    initializePodData: (_, action: PayloadAction<PodDataAdapter>) => {
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

export const { initializePodData, updatePodData } = podDataSlice.actions;

export default podDataSlice.reducer;

export function selectPodDataNames(state: RootState): TreeNode {
  return Object.fromEntries(
    Object.values(state.podData.boards).map((board) => {
      return [
        board.name,
        Object.fromEntries(
          Object.values(board.packets).map((packet) => {
            return [
              packet.name,
              Object.fromEntries(
                Object.values(packet.measurements).map((measurement) => {
                  return [measurement.name, undefined];
                })
              ),
            ];
          })
        ),
      ];
    })
  );
}

export function selectUpdatedMeasurements(state: RootState): {
  [measurementName: string]: string;
} {
  let updatedMeasurements = {};
  for (let update of Object.values(state.podData.lastUpdates)) {
    Object.assign(updatedMeasurements, update.measurementUpdates);
  }

  return updatedMeasurements;
}
