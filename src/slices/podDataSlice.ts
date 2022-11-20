import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createEmptyPodData } from "@models/PodData/PodData";
import {
  updatePodData as updatePackets,
  setLastBatchIDs,
} from "@models/PodData/PodData";
import { PacketUpdate } from "@adapters/PacketUpdate";

export const podDataSlice = createSlice({
  name: "podData",
  initialState: createEmptyPodData(),
  reducers: {
    initializePodData: (_, action) => {
      return action.payload;
    },
    updatePodData: (
      podData,
      action: PayloadAction<{ [id: number]: PacketUpdate }>
    ) => {
      let updates = action.payload;
      setLastBatchIDs(podData, updates);
      updatePackets(podData, updates);
    },
  },
});

export const { initializePodData, updatePodData } = podDataSlice.actions;

export default podDataSlice.reducer;
