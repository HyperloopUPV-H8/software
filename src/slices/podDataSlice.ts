import { createSlice } from "@reduxjs/toolkit";
import type { PodData } from "@models/PodData/PodData";
import {
  updatePodData as updatePackets,
  setLastBatchIDs,
} from "@models/PodData/PodData";

export const podDataSlice = createSlice({
  name: "podData",
  initialState: { boards: [], lastBatchIDs: [] } as PodData,
  reducers: {
    initializePodData: (podData, action) => {
      return action.payload;
    },
    updatePodData: (podData, action) => {
      let updates = action.payload;
      setLastBatchIDs(podData, updates);
      updatePackets(podData, updates);
    },
  },
});

export const { initializePodData, updatePodData } = podDataSlice.actions;

export default podDataSlice.reducer;
