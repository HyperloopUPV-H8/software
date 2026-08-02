// Pure data-gathering for the optional Statistics/Annex report pages —
// operates on plain store state (Pick<...>), no hooks, so it can run once at
// export time via useStore.getState() rather than subscribing.
import { computeRangeStats } from "../plotStudio/stats";
import { isDiscreteSeries } from "../plotStudio/timeline";
import { boardOf, getSignalName, getSignalType, getSignalUnits, isDiscreteMeasurement } from "../plotStudio/units";
import { resolveSignalColor } from "../plotStudio/palette";
import { displayName, getSignal, type PlotStudioSlice } from "../../store/slices/plotStudioSlice";
import type { AdjArchive, LoggerSettings } from "../../types/session";
import type { PlotState } from "../../types/plotStudio";
import type { AnnexRow, SessionInfo, StatsRow } from "./types";

type SignalState = Pick<PlotStudioSlice, "studioFiles" | "studioOperations" | "studioTransforms">;

// Mirrors PlotWrapper's hasTimeline heuristic (ADJ type metadata first, data
// shape as a fallback for plain CSV signals) but ignores FFT mode — the
// report always uses raw time-domain data regardless of a plot's current
// FFT toggle, so FFT has no bearing on whether a plot is a Cronograma.
function isTimelinePlot(plot: PlotState, state: SignalState, adjData: AdjArchive | null): boolean {
  const firstSignal = plot.signals[0];
  if (!firstSignal) return false;
  if (getSignalType(adjData, firstSignal.signalId) !== undefined) {
    return isDiscreteMeasurement(adjData, firstSignal.signalId);
  }
  const data = getSignal(firstSignal.signalId, state)?.data;
  return !!data && isDiscreteSeries(data);
}

/** Full-data-range stats for every non-timeline signal across the given
 * plots, grouped (in order) by plot. */
export function collectStatsRows(
  visiblePlots: PlotState[],
  state: SignalState,
  adjData: AdjArchive | null,
): StatsRow[] {
  const rows: StatsRow[] = [];
  for (const plot of visiblePlots) {
    if (isTimelinePlot(plot, state, adjData)) continue;
    for (const sig of plot.signals) {
      const signal = getSignal(sig.signalId, state);
      const data = signal?.data;
      if (!data || data.value.length < 2) continue;
      const result = computeRangeStats(data, null);
      if (!result) continue;
      const name = getSignalName(adjData, sig.signalId) ?? displayName(signal?.name ?? sig.signalId);
      rows.push({
        plotName: plot.name,
        signalName: name,
        mean: result.stats.mean,
        std: result.stats.std,
        rms: result.stats.rms,
        peakToPeak: result.stats.peakToPeak,
        min: result.stats.min,
        max: result.stats.max,
        noiseFloor: result.floor.noiseFloor,
        samples: result.stats.count,
      });
    }
  }
  return rows;
}

/** Series metadata across all given plots, deduped by signalId — the color
 * shown is from the first plot in which the signal appears. */
export function collectAnnexRows(
  visiblePlots: PlotState[],
  state: SignalState,
  adjData: AdjArchive | null,
): AnnexRow[] {
  const rows = new Map<string, AnnexRow>();
  for (const plot of visiblePlots) {
    plot.signals.forEach((sig) => {
      if (rows.has(sig.signalId)) return;
      const signal = getSignal(sig.signalId, state);
      const name = getSignalName(adjData, sig.signalId) ?? displayName(signal?.name ?? sig.signalId);
      rows.set(sig.signalId, {
        signalId: sig.signalId,
        name,
        board: boardOf(sig.signalId),
        unit: getSignalUnits(adjData, sig.signalId),
        type: getSignalType(adjData, sig.signalId),
        color: resolveSignalColor(sig.color, sig.colorIndex),
      });
    });
  }
  return Array.from(rows.values());
}

/** Session metadata for the TOC page's "Session Configuration" block. */
export function collectSessionInfo(input: { folderName: string | null; settings: LoggerSettings | null }): SessionInfo {
  return {
    folderName: input.folderName,
    date: input.settings?.date ?? null,
    timeUnit: input.settings?.time_unit ?? null,
    adjCommitHash: input.settings?.adj_commit_hash ?? null,
  };
}
