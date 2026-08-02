// D3 Category10 — Plotly's default colorway, pinned explicitly so the UI
// (signal chips, stats headers) can show the exact color of each trace.
export const TRACE_COLORS = [
  "#1f77b4", // blue
  "#ff7f0e", // orange
  "#2ca02c", // green
  "#d62728", // red
  "#9467bd", // purple
  "#8c564b", // brown
  "#e377c2", // pink
  "#7f7f7f", // gray
  "#bcbd22", // olive
  "#17becf", // cyan
] as const;

export const traceColor = (index: number): string =>
  TRACE_COLORS[index % TRACE_COLORS.length];

// Resolves the color actually shown for a signal: its user-picked override
// (PlotSignal.color) if set, otherwise the palette color by index.
export const resolveSignalColor = (color: string | undefined, index: number): string =>
  color ?? traceColor(index);
