/** Maximum number of data points kept per chart series (memory safety cap). */
export const CHART_MAX_POINTS = 2000;

/** Width, in seconds, of the rolling time window shown by real-time charts. */
export const CHART_WINDOW_SECONDS = 10;

/** Default rendered height of a chart in pixels. */
export const CHART_HEIGHT = 220;

/** Stroke width for chart lines. */
export const CHART_LINE_WIDTH = 2;

/** Diameter of the dot drawn at each data point. */
export const CHART_POINT_SIZE = 2;

/** Colour palette — one entry per series (competition orange first). */
export const CHART_COLORS = [
  "#ff7f24", // primary orange
  "#2563eb", // blue
  "#10b981", // green
  "#ef4444", // red
  "#8b5cf6", // purple
] as const;

const compactFormatter = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 });

/**
 * Formats an axis tick value, keeping the label short so uPlot never drops
 * it for lack of space. `Intl`'s compact notation only abbreviates up to
 * "T" (1e12) and prints the full digit string beyond that, so magnitudes
 * past 1e6 fall back to exponential notation instead.
 */
export const formatAxisValue = (value: number): string => {
  if (!Number.isFinite(value)) return "";
  const abs = Math.abs(value);
  if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return value.toExponential(1);
  return compactFormatter.format(value);
};

/**
 * "Nice" 1/2/5 × 10^n increments spanning the full float64 exponent range.
 * uPlot's built-in table tops out around 1e32, so a garbage/misdecoded
 * telemetry sample (float64 reinterpreted from bad bytes can reach ~1e308)
 * leaves `findIncr` with no usable increment, which silently renders the
 * axis with zero ticks — this table ensures one is always found.
 */
export const CHART_AXIS_INCRS: number[] = (() => {
  const incrs: number[] = [];
  for (let exp = -24; exp <= 308; exp++) {
    for (const m of [1, 2, 5]) incrs.push(m * Math.pow(10, exp));
  }
  return incrs;
})();
