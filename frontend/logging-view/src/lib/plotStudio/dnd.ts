// Drag payload for dragging measurement rows from the left Series sidebar
// (src/components/sidebar/SeriesGroup.tsx) onto a plot card
// (src/components/simple/plots/PlotWrapper.tsx). The two ends live in
// unrelated component subtrees, so the payload travels via DataTransfer
// rather than shared React state (contrast with the same-tree plot-reorder
// drag in PlotsSection.tsx, which just uses local state).
//
// Custom MIME (not "text/plain") so a drop target can gate its "droppable"
// highlight on e.dataTransfer.types during dragenter/dragover — browsers
// only expose getData() at the actual drop, so type-checking is the only
// way to distinguish a relevant drag before it's dropped.
export const SIGNAL_IDS_MIME = "application/x-hl-signal-ids";

export function encodeSignalIds(ids: string[]): string {
  return JSON.stringify(ids);
}

// Malformed/foreign payload → [] — callers treat that as "nothing to add".
export function decodeSignalIds(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) return parsed;
  } catch {
    /* ignore malformed payload */
  }
  return [];
}
