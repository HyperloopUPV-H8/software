// Global app preferences slice.
// Only isDarkMode is persisted (see store.ts partialize).
import type { StateCreator } from "zustand";
import type { Store } from "../store";

export interface AppSlice {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setIsDarkMode: (isDarkMode: boolean) => void;
  // Flips to false the first time any Plotly chart reports a lost WebGL
  // context (some Linux/software-GPU setups can't sustain scattergl at all).
  // Once false, all charts fall back to SVG rendering for the rest of the session.
  webglAvailable: boolean;
  setWebglUnavailable: () => void;
}

export const createAppSlice: StateCreator<Store, [], [], AppSlice> = (set) => ({
  isDarkMode: true,
  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
  setIsDarkMode: (isDarkMode) => set({ isDarkMode }),
  webglAvailable: true,
  setWebglUnavailable: () => set({ webglAvailable: false }),
});
