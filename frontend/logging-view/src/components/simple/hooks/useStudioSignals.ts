// Shared hooks for the Plot Studio signal catalog.
//
// Every session series is available for plotting by default — no manual load
// step. CSVs are parsed lazily the first time a signal is actually used
// (assigned to a plot or picked in an operation/transform) and cached in
// studioFiles afterwards.
import { useCallback, useMemo } from "react";
import { parseCSVInWorker } from "../../../lib/plotStudio/csv";
import { getEnumLabels, getSignalName } from "../../../lib/plotStudio/units";
import { useStore } from "../../../store/store";
import type { SeriesData } from "../../../types/plotStudio";

export interface AvailableSignal {
  /** "BOARD/measId" for session series, "op_N" / "tr_N" for composed ones. */
  id: string;
  /** Display label without the board prefix. */
  label: string;
  /** Board name for grouping; null for composed signals. */
  board: string | null;
  kind: "series" | "operation" | "transform";
}

/** Catalog of everything that can be plotted: all session series + composed. */
export function useAvailableSignals(): AvailableSignal[] {
  const availableSeries = useStore((s) => s.availableSeries);
  const studioOperations = useStore((s) => s.studioOperations);
  const studioTransforms = useStore((s) => s.studioTransforms);
  const adjData = useStore((s) => s.adjData);

  return useMemo(() => {
    const list: AvailableSignal[] = [];
    for (const [board, measIds] of Object.entries(availableSeries)) {
      for (const measId of [...measIds].sort()) {
        const id = `${board}/${measId}`;
        list.push({ id, label: getSignalName(adjData, id) ?? measId, board, kind: "series" });
      }
    }
    studioOperations.forEach((op) =>
      list.push({ id: op.id, label: op.name, board: null, kind: "operation" }),
    );
    studioTransforms.forEach((tr) =>
      list.push({ id: tr.id, label: tr.name, board: null, kind: "transform" }),
    );
    return list;
  }, [availableSeries, studioOperations, studioTransforms, adjData]);
}

/**
 * Returns an async resolver that guarantees a signal's data is available:
 * cached data is returned directly; session series are parsed from their CSV
 * on first use and stored in studioFiles.
 */
export function useSignalLoader() {
  const sessionFiles = useStore((s) => s.sessionFiles);
  const folderName = useStore((s) => s.folderName);
  const settings = useStore((s) => s.settings);
  const studioFiles = useStore((s) => s.studioFiles);
  const studioOperations = useStore((s) => s.studioOperations);
  const studioTransforms = useStore((s) => s.studioTransforms);
  const addStudioFiles = useStore((s) => s.addStudioFiles);
  const adjData = useStore((s) => s.adjData);

  return useCallback(
    async (signalId: string): Promise<SeriesData | null> => {
      const cached =
        studioFiles.get(signalId)?.data ??
        studioOperations.get(signalId)?.data ??
        studioTransforms.get(signalId)?.data;
      if (cached) return cached;

      // Only "BOARD/measId" ids can be parsed from session CSVs
      if (!folderName || !signalId.includes("/")) return null;
      const slash = signalId.indexOf("/");
      const board = signalId.slice(0, slash);
      const measId = signalId.slice(slash + 1);
      const file = sessionFiles.get(`${folderName}/data/${board}/${measId}.csv`);
      if (!file) return null;

      // Enum/bool signals are logged as text state names ("Idle", "true"),
      // not the numeric code — pass the known ADJ state names so parseCSV
      // can recover the matching code instead of dropping every row.
      const enumValues = getEnumLabels(adjData, signalId);
      const data = await parseCSVInWorker(file, settings?.time_unit ?? "ms", enumValues);
      if (data.value.length === 0) return null;
      addStudioFiles([{ name: signalId, data, pointCount: data.value.length }]);
      return data;
    },
    [sessionFiles, folderName, settings, studioFiles, studioOperations, studioTransforms, addStudioFiles, adjData],
  );
}

/**
 * Loads each signal id (sequentially — avoids firing many concurrent CSV
 * parses for a large multi-select) and assigns it to plotId. Ids that fail
 * to load are silently skipped (no toast system in this app — matches
 * useSignalLoader's null-on-failure convention); already-assigned ids are a
 * no-op via addSignalToStudioPlot's own dedup guard.
 */
export function useAssignSignalsToPlot() {
  const ensureLoaded = useSignalLoader();
  const addSignalToStudioPlot = useStore((s) => s.addSignalToStudioPlot);

  return useCallback(
    async (plotId: string, signalIds: string[]) => {
      for (const id of signalIds) {
        const data = await ensureLoaded(id);
        if (data) addSignalToStudioPlot(plotId, id);
      }
    },
    [ensureLoaded, addSignalToStudioPlot],
  );
}
