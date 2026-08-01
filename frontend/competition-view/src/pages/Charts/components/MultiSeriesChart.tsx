import { memo, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";
import {
  CHART_AXIS_INCRS,
  CHART_COLORS,
  CHART_HEIGHT,
  CHART_LINE_WIDTH,
  CHART_MAX_POINTS,
  CHART_POINT_SIZE,
  CHART_TRIM_SLACK,
  CHART_WINDOW_SECONDS,
  formatAxisValue,
} from "../../../constants/chartConfig";
import { useAllStale } from "../../../hooks/useIsStale";
import { useStore } from "../../../store/store";

export interface SeriesConfig {
  /** Board name (must match backend, use BOARDS constants). */
  board: string;
  /** Measurement ID within that board. */
  measurementKey: string;
  /** Short label shown in the legend (e.g. "U", "V", "W"). */
  label: string;
  /** Index into CHART_COLORS. Falls back to the series' position index. */
  colorIndex?: number;
}

interface MultiSeriesChartProps {
  title: string;
  /** Icon shown before the title, e.g. from lucide-react. */
  icon?: LucideIcon;
  series: SeriesConfig[];
  unit?: string;
}

/**
 * Real-time chart with up to 5 simultaneous series — designed for the
 * three-phase DLIM / LSM current charts.
 *
 * Series configs must be a stable reference (defined at module level or
 * memoized) so the Zustand selector and uPlot init only run once.
 *
 * The x-axis is wall-clock time (seconds) and the visible range is
 * pinned to a rolling window ending at the latest sample, so the chart
 * keeps advancing even under bursty, high-frequency packet rates.
 *
 * Telemetry is consumed through a transient store subscription that feeds
 * uPlot directly, so data updates never re-render the React component.
 * Redraws are batched to animation frames.
 *
 * A compact colour-dot legend is rendered in the card header.
 * Zoom is disabled; only hover crosshair interaction is active.
 */
const MultiSeriesChart = memo(({ title, icon: Icon, series, unit = "" }: MultiSeriesChartProps) => {
  const wrapperRef   = useRef<HTMLDivElement>(null); // flex-1 div sized by CSS layout
  const containerRef = useRef<HTMLDivElement>(null); // uPlot mounting point
  const uplotRef     = useRef<uPlot | null>(null);
  const xRef         = useRef<number[]>([]);
  const yRefs        = useRef<number[][]>(series.map(() => []));
  const startRef     = useRef(performance.now());

  // Subtle yellow tint when the whole data stream stopped arriving.
  const stale = useAllStale(series);

  // ── Initialise uPlot ────────────────────────────────────────────────────
  useEffect(() => {
    if (!wrapperRef.current || !containerRef.current) return;

    const getVar = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    const uplotSeries: uPlot.Series[] = [
      {}, // x-axis placeholder
      ...series.map(({ label, colorIndex }, i) => {
        const color = CHART_COLORS[(colorIndex ?? i) % CHART_COLORS.length];
        return {
          label,
          stroke: color,
          width:  CHART_LINE_WIDTH,
          points: { show: true, size: CHART_POINT_SIZE, fill: color, width: 0 },
        };
      }),
    ];

    const opts: uPlot.Options = {
      width:  wrapperRef.current.clientWidth  || 300,
      height: wrapperRef.current.clientHeight || CHART_HEIGHT,
      legend:  { show: false },
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
      series: uplotSeries,
      // Stroke callbacks re-read the CSS variables on every draw so the
      // axes/grid follow light/dark theme switches (see redraw observer below).
      axes: [
        {
          stroke: () => getVar("--muted-foreground"),
          grid:   { show: false },
          font:   "10px Archivo",
          size:   24,
          values: (_, ticks) => ticks.map(formatAxisValue),
        },
        {
          side:   1,
          stroke: () => getVar("--muted-foreground"),
          grid:   { stroke: () => getVar("--border") },
          font:   "10px Archivo",
          size:   36,
          incrs:  CHART_AXIS_INCRS,
          values: (_, ticks) => ticks.map(formatAxisValue),
        },
      ],
      cursor: { drag: { setScale: false, x: false, y: false } },
    };

    const initialData: uPlot.AlignedData = [[], ...series.map(() => [] as number[])];
    uplotRef.current = new uPlot(opts, initialData, containerRef.current);

    return () => {
      uplotRef.current?.destroy();
      uplotRef.current = null;
    };
    // Intentionally runs once on mount — series config is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Feed new data points (transient subscription, no React re-renders) ──
  useEffect(() => {
    let rafId = 0;
    let lastValues: (number | boolean | string | undefined)[] | null = null;

    // Coalesce redraws to one per animation frame (and none while hidden).
    const flush = () => {
      rafId = 0;
      uplotRef.current?.setData([xRef.current, ...yRefs.current]);
    };

    const ingest = (telemetry: ReturnType<typeof useStore.getState>["telemetry"]) => {
      const values = series.map(({ board, measurementKey }) => telemetry[board]?.[measurementKey]);

      // Skip when nothing this chart plots has changed.
      if (lastValues && values.every((v, i) => v === lastValues![i])) return;
      lastValues = values;

      // Only push a point when every series has a numeric value (all phases
      // arrive in the same telemetry packet so this is normally always true).
      if (!values.every((v) => typeof v === "number")) return;

      xRef.current.push((performance.now() - startRef.current) / 1000);
      (values as number[]).forEach((v, i) => {
        yRefs.current[i].push(v);
      });

      // Trim with slack so the slice allocation is amortised instead of
      // happening on every single update once the cap is reached.
      if (xRef.current.length > CHART_MAX_POINTS + CHART_TRIM_SLACK) {
        xRef.current  = xRef.current.slice(-CHART_MAX_POINTS);
        yRefs.current = yRefs.current.map((y) => y.slice(-CHART_MAX_POINTS));
      }

      if (!rafId) rafId = requestAnimationFrame(flush);
    };

    ingest(useStore.getState().telemetry);
    const unsubscribe = useStore.subscribe((state, prevState) => {
      if (state.telemetry !== prevState.telemetry) ingest(state.telemetry);
    });

    return () => {
      unsubscribe();
      if (rafId) cancelAnimationFrame(rafId);
    };
    // Intentionally runs once on mount — series config is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // ── Repaint on theme switch ─────────────────────────────────────────────
  // AppLayout toggles the `dark` class on <html>; redrawing re-runs the
  // axis/grid stroke callbacks so the chart picks up the new theme colours.
  useEffect(() => {
    const observer = new MutationObserver(() => uplotRef.current?.redraw());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`flex h-full min-h-0 flex-col rounded-xl border shadow-sm transition-colors duration-300 ${
      stale ? "border-yellow-500/40 bg-yellow-500/10" : "bg-card"
    }`}>
      <div className="flex shrink-0 items-center justify-between px-4 pb-1 pt-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1.5">
            {Icon && <Icon className="text-muted-foreground size-4" />}
            <span className="text-foreground text-sm font-semibold">{title}</span>
          </span>
          {series.map(({ label, colorIndex }, i) => {
            const color = CHART_COLORS[(colorIndex ?? i) % CHART_COLORS.length];
            return (
              <span key={label} className="flex items-center gap-1">
                <span className="inline-block size-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-muted-foreground text-xs">{label}</span>
              </span>
            );
          })}
        </div>
        {unit && <span className="text-muted-foreground shrink-0 text-xs">{unit}</span>}
      </div>
      <div ref={wrapperRef} className="min-h-0 flex-1 px-1 pb-2">
        <div ref={containerRef} />
      </div>
    </div>
  );
});

MultiSeriesChart.displayName = "MultiSeriesChart";
export default MultiSeriesChart;
