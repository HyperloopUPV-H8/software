import { memo, useEffect, useRef } from "react";
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";
import {
  CHART_AXIS_INCRS,
  CHART_COLORS,
  CHART_HEIGHT,
  CHART_LINE_WIDTH,
  CHART_MAX_POINTS,
  CHART_POINT_SIZE,
  CHART_WINDOW_SECONDS,
  formatAxisValue,
} from "../../../constants/chartConfig";
import useMeasurement from "../../../hooks/useMeasurement";

interface TelemetryChartProps {
  /** Human-readable label shown in the card header. */
  title: string;
  /** Board name (must match backend, use BOARDS constants). */
  board: string;
  /** Measurement ID within that board. */
  measurementKey: string;
  /** Unit appended to the y-axis label. */
  unit?: string;
  /** Index into CHART_COLORS. Defaults to 0 (primary orange). */
  colorIndex?: number;
}

/**
 * Fixed single-series real-time chart for competition telemetry.
 *
 * History is accumulated in a local ref (no store involvement) so the
 * component stays lightweight. The x-axis is wall-clock time (seconds)
 * and the visible range is pinned to a rolling window ending at the
 * latest sample, so the chart keeps advancing even under bursty,
 * high-frequency packet rates. Double-click resets a manual zoom.
 */
const TelemetryChart = memo(({
  title,
  board,
  measurementKey,
  unit = "",
  colorIndex = 0,
}: TelemetryChartProps) => {
  const wrapperRef   = useRef<HTMLDivElement>(null); // flex-1 div sized by CSS layout
  const containerRef = useRef<HTMLDivElement>(null); // uPlot mounting point
  const uplotRef     = useRef<uPlot | null>(null);
  const xRef         = useRef<number[]>([]);
  const yRef         = useRef<number[]>([]);
  const startRef     = useRef(performance.now());

  const value = useMeasurement(board, measurementKey);
  const color = CHART_COLORS[colorIndex % CHART_COLORS.length];

  // ── Initialise uplot ────────────────────────────────────────────────────
  useEffect(() => {
    if (!wrapperRef.current || !containerRef.current) return;

    const getVar = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    const opts: uPlot.Options = {
      width:  wrapperRef.current.clientWidth  || 300,
      height: wrapperRef.current.clientHeight || CHART_HEIGHT,
      legend: { show: false },
      padding: [16, 8, 4, 12],
      scales: {
        x: {
          time: false,
          range: (_, __, dataMax) =>
            dataMax == null
              ? [0, CHART_WINDOW_SECONDS]
              : [dataMax - CHART_WINDOW_SECONDS, dataMax],
        },
        y: {
          range: (_, min, max) => {
            if (min === max) return [min - 1, max + 1];
            const span   = max - min;
            const buffer = span * 0.15;
            return [min - buffer, max + buffer];
          },
        },
      },
      series: [
        {},
        {
          label:  measurementKey,
          stroke: color,
          width:  CHART_LINE_WIDTH,
          points: { show: true, size: CHART_POINT_SIZE, fill: color, width: 0 },
        },
      ],
      axes: [
        {
          stroke: getVar("--muted-foreground"),
          grid:   { show: false },
          font:   "10px Archivo",
          size:   24,
          values: (_, ticks) => ticks.map(formatAxisValue),
        },
        {
          side:   1,
          stroke: getVar("--muted-foreground"),
          grid:   { stroke: getVar("--border") },
          font:   "10px Archivo",
          size:   36,
          incrs:  CHART_AXIS_INCRS,
          values: (_, ticks) => ticks.map(formatAxisValue),
        },
      ],
      cursor: { drag: { setScale: true, x: true, y: true } },
    };

    uplotRef.current = new uPlot(opts, [[], []], containerRef.current);

    const handleDblClick = () => uplotRef.current?.setScale("x", { min: null as unknown as number, max: null as unknown as number });
    wrapperRef.current.addEventListener("dblclick", handleDblClick);

    return () => {
      uplotRef.current?.destroy();
      uplotRef.current = null;
      wrapperRef.current?.removeEventListener("dblclick", handleDblClick);
    };
  // Intentionally runs once on mount — series config is stable.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Feed new data points ────────────────────────────────────────────────
  useEffect(() => {
    if (typeof value !== "number" || !uplotRef.current) return;

    xRef.current.push((performance.now() - startRef.current) / 1000);
    yRef.current.push(value);

    if (xRef.current.length > CHART_MAX_POINTS) {
      xRef.current = xRef.current.slice(-CHART_MAX_POINTS);
      yRef.current = yRef.current.slice(-CHART_MAX_POINTS);
    }

    uplotRef.current.setData([xRef.current, yRef.current]);
  }, [value]);

  // ── Resize to wrapper ───────────────────────────────────────────────────
  useEffect(() => {
    if (!wrapperRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          uplotRef.current?.setSize({ width, height });
        }
      }
    });

    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-card flex h-full min-h-0 flex-col rounded-xl border shadow-sm">
      <div className="flex shrink-0 items-center justify-between px-4 pb-1 pt-3">
        <span className="text-foreground text-sm font-semibold">{title}</span>
        {unit && (
          <span className="text-muted-foreground text-xs">{unit}</span>
        )}
      </div>
      <div ref={wrapperRef} className="min-h-0 flex-1 px-1 pb-2">
        <div ref={containerRef} />
      </div>
    </div>
  );
});

TelemetryChart.displayName = "TelemetryChart";

export default TelemetryChart;
