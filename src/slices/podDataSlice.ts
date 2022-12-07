import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createEmptyPodData } from "@models/PodData/PodData";
import { createPodDataFromAdapter } from "@adapters/PodData";
import { updatePodData as updatePackets } from "@models/PodData/PodData";
import { PacketUpdate } from "@adapters/PacketUpdate";
import { PodDataAdapter } from "@adapters/PodData";
export const podDataSlice = createSlice({
  name: "podData",
  initialState: createEmptyPodData(),
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
