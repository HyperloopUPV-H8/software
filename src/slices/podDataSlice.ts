import { createSlice } from "@reduxjs/toolkit";
import { PodData } from "@models/PodData/PodData";

export const podDataSlice = createSlice({
  name: "podData",
  initialState: new PodData([]),
  reducers: {
    initializePodData: (podData, action) => {
      return action.payload;
    },
    updatePodData: (podData, action) => {
      let updates = action.payload;
      podData.setLastBatchIDs(updates);
      podData.update(updates);
    },
  },
});

export const { initializePodData, updatePodData } = podDataSlice.actions;

export default podDataSlice.reducer;
