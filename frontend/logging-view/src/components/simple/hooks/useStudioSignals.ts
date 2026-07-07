// Shared hooks for the Plot Studio signal catalog.
//
// Every session series is available for plotting by default — no manual load
// step. CSVs are parsed lazily the first time a signal is actually used
// (assigned to a plot or picked in an operation/transform) and cached in
// studioFiles afterwards.
import { useCallback, useMemo } from "react";
import { parseCSV } from "../../../lib/plotStudio/csv";
import { useStore } from "../../../store/store";
import type { SignalPoint } from "../../../types/plotStudio";

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

  return useMemo(() => {
    const list: AvailableSignal[] = [];
    for (const [board, measIds] of Object.entries(availableSeries)) {
      for (const measId of [...measIds].sort()) {
        list.push({ id: `${board}/${measId}`, label: measId, board, kind: "series" });
      }
    }
    studioOperations.forEach((op) =>
      list.push({ id: op.id, label: op.name, board: null, kind: "operation" }),
    );
    studioTransforms.forEach((tr) =>
      list.push({ id: tr.id, label: tr.name, board: null, kind: "transform" }),
    );
    return list;
  }, [availableSeries, studioOperations, studioTransforms]);
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

  return useCallback(
    async (signalId: string): Promise<SignalPoint[] | null> => {
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

      const text = await file.text();
      const data = parseCSV(text, settings?.time_unit ?? "ms");
      if (data.length === 0) return null;
      addStudioFiles([{ name: signalId, data, pointCount: data.length }]);
      return data;
    },
    [sessionFiles, folderName, settings, studioFiles, studioOperations, studioTransforms, addStudioFiles],
  );
}
