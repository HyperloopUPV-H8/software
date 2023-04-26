import { createPodDataSlice } from "common";

export const podDataSlice = createPodDataSlice();

export const { initPodData, updatePodData } = podDataSlice.actions;

export default podDataSlice.reducer;
