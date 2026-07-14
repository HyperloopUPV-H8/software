import type { StateCreator } from "zustand";
import { markFresh } from "../../lib/freshness";
import type { TelemetryData, TelemetryState } from "../../types/telemetry";
import type { Store } from "../store";

export interface TelemetrySlice {
  telemetry: TelemetryState;
  /** Maps numeric packet ID → board name. Populated from podDataStructure on connect. */
  packetBoard: Record<number, string>;
  setPacketBoard: (map: Record<number, string>) => void;
  updateTelemetry: (packets: TelemetryData) => void;
  getMeasurement: (board: string, id: string) => number | boolean | string | undefined;
}

export const createTelemetrySlice: StateCreator<
  Store,
  [],
  [],
  TelemetrySlice
> = (set, get) => ({
  telemetry: {},
  packetBoard: {},

  setPacketBoard: (map) => set({ packetBoard: map }),

  updateTelemetry: (packets) => {
    const boardMap = get().packetBoard;
    const updates: TelemetryState = {};
    const now = Date.now();

    for (const [packetIdStr, packet] of Object.entries(packets)) {
      const boardName = boardMap[Number(packetIdStr)];
      if (!boardName) continue;

      if (!updates[boardName]) updates[boardName] = {};

      for (const [key, value] of Object.entries(packet.measurementUpdates)) {
        if (typeof value === "object" && value !== null && "last" in value) {
          updates[boardName][key] = value.last;
        } else {
          updates[boardName][key] = value as number | boolean | string;
        }
        markFresh(boardName, key, now);
      }
    }

    // Don't wake subscribers when no packet mapped to a known board.
    const boards = Object.keys(updates);
    if (boards.length === 0) return;

    set((state) => {
      const newTelemetry = { ...state.telemetry };
      for (const board of boards) {
        newTelemetry[board] = { ...newTelemetry[board], ...updates[board] };
      }
      return { telemetry: newTelemetry };
    });
  },

  getMeasurement: (board, id) => get().telemetry[board]?.[id],
});
