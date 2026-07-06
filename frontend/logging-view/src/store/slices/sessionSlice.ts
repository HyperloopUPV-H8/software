// Session slice: manages the opened log folder, fetched ADJ data, and series selection.
//
// Flow: openSession(FileList) → read logger_settings.json → fetch ADJ archive →
//       scan data/ entries → update state.
//
// Files are keyed by webkitRelativePath ("folder/data/BOARD/meas.csv") and kept
// in sessionFiles for later CSV reading during plotting. Not persisted.
import type { StateCreator } from "zustand";
import type { AdjArchive, DroppedFile, LoggerSettings, SeriesKey } from "../../types/session";
import type { Store } from "../store";

const ADJ_ARCHIVE_URL = (hash: string) =>
  `https://hyperloop-upv.github.io/ADJ-Archive/storage/commit-${hash}.json`;

export interface SessionSlice {
  folderName: string | null;
  settings: LoggerSettings | null;
  adjData: AdjArchive | null;
  // Board name → array of measurement IDs found in data/<BOARD>/*.csv
  availableSeries: Record<string, string[]>;
  // Selected series keys ("BOARD/measurementId") stored as a set-like Record.
  selectedSeries: Record<SeriesKey, boolean>;
  // All session files keyed by webkitRelativePath, for later CSV reading.
  sessionFiles: Map<string, File>;
  isLoading: boolean;
  sessionError: string | null;

  // Accepts files from <input webkitdirectory> or a directory drop traversal.
  openSession: (files: DroppedFile[]) => Promise<void>;
  toggleSeries: (key: SeriesKey) => void;
  clearSession: () => void;
}

export const createSessionSlice: StateCreator<Store, [], [], SessionSlice> = (set) => ({
  folderName: null,
  settings: null,
  adjData: null,
  availableSeries: {},
  selectedSeries: {},
  sessionFiles: new Map(),
  isLoading: false,
  sessionError: null,

  openSession: async (files) => {
    try {
      set({ isLoading: true, sessionError: null });

      const fileArray = files;

      // Derive the session folder name from the first file's relative path.
      const folderName = fileArray[0]?.webkitRelativePath.split("/")[0] ?? "Session";

      // Locate logger_settings.json at the root of the selected folder (2 path segments).
      const settingsFile = fileArray.find(
        (f) =>
          f.name === "logger_settings.json" &&
          f.webkitRelativePath.split("/").length === 2,
      );
      if (!settingsFile) throw new Error("logger_settings.json not found in selected folder");
      const settings: LoggerSettings = JSON.parse(await settingsFile.text());

      // Fetch the ADJ archive snapshot at the recorded commit.
      const adjResponse = await fetch(ADJ_ARCHIVE_URL(settings.adj_commit_hash));
      if (!adjResponse.ok) throw new Error(`ADJ fetch failed: ${adjResponse.status}`);
      const adjData: AdjArchive = await adjResponse.json();

      // Build board → measurementIds map from data/<BOARD>/<id>.csv files.
      // webkitRelativePath format: folder/data/BOARD/measurement.csv (4 segments).
      const availableSeries: Record<string, string[]> = {};
      for (const f of fileArray) {
        const parts = f.webkitRelativePath.split("/");
        if (parts.length === 4 && parts[1] === "data" && f.name.endsWith(".csv")) {
          const boardName = parts[2];
          const measId = f.name.slice(0, -4);
          (availableSeries[boardName] ??= []).push(measId);
        }
      }

      set({
        folderName,
        settings,
        adjData,
        availableSeries,
        selectedSeries: {},
        sessionFiles: new Map(fileArray.map((f) => [f.webkitRelativePath, f])),
        isLoading: false,
      });
    } catch (err) {
      set({ sessionError: String(err), isLoading: false });
    }
  },

  toggleSeries: (key) =>
    set((s) => ({
      selectedSeries: {
        ...s.selectedSeries,
        [key]: !s.selectedSeries[key],
      },
    })),

  clearSession: () =>
    set({
      folderName: null,
      settings: null,
      adjData: null,
      availableSeries: {},
      selectedSeries: {},
      sessionFiles: new Map(),
      sessionError: null,
    }),
});
