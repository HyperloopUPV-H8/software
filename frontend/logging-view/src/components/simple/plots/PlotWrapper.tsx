// One plot card: header (rename, zoom, stats, export, delete), Plotly chart,
// drag-to-resize handle and an optional statistics panel.
// Trace colors are pinned via lib/plotStudio/palette so sidebar chips and
// stats headers can mirror the exact color of each curve.
import {
  Button,
  Input,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components";
import { Activity, AlertTriangle, Pencil, RefreshCw, Trash2 } from "@workspace/ui/icons";
import Plotly from "plotly.js-dist";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { computeFFT } from "../../../lib/plotStudio/fft";
import { resolveSignalColor } from "../../../lib/plotStudio/palette";
import { commonUnits, getSignalName, getSignalUnits, unitsMismatch } from "../../../lib/plotStudio/units";
import { displayName, getSignalData } from "../../../store/slices/plotStudioSlice";
import { useStore } from "../../../store/store";
import type { PlotState } from "../../../types/plotStudio";
import StatsPanel from "../StatsPanel";
import PlotlyChart, { type PlotlyChartHandle } from "./PlotlyChart";

const PLOTLY_CONFIG: Partial<Plotly.Config> = {
  responsive: true,
  displayModeBar: true,
  displaylogo: false,
  scrollZoom: true,
  showTips: false,
  modeBarButtonsToRemove: ["select2d", "lasso2d"],
  modeBarButtonsToAdd: ["togglespikelines", "hoverclosest", "hovercompare"],
  editable: true,
  toImageButtonOptions: { format: "svg", width: 1200, height: 800, scale: 1 },
};

// Above this point count, render with WebGL (scattergl) instead of SVG —
// logging sessions easily reach 100k+ samples per signal.
const GL_POINT_THRESHOLD = 20_000;

// Plotly divs expose a Node-style event emitter after newPlot()
type PlotlyEventDiv = HTMLDivElement & {
  on?: (event: string, cb: () => void) => void;
  removeAllListeners?: (event: string) => void;
};

// Defined outside component — no components created during render
function ZoomGroup({
  label,
  axis,
  onZoom,
}: {
  label: string;
  axis: "x" | "y1" | "y2";
  onZoom: (axis: "x" | "y1" | "y2", dir: "in" | "out") => void;
}) {
  return (
    <div className="bg-muted/60 flex items-center gap-0.5 rounded-md px-1.5 py-0.5">
      <span className="text-muted-foreground mr-1 min-w-[20px] text-center text-[10px] font-semibold">{label}</span>
      <button type="button" onClick={() => onZoom(axis, "in")} aria-label={`Zoom in ${label}`}
        className="hover:bg-primary/20 hover:text-primary flex size-4 items-center justify-center rounded text-xs font-bold transition-colors">
        +
      </button>
      <button type="button" onClick={() => onZoom(axis, "out")} aria-label={`Zoom out ${label}`}
        className="hover:bg-primary/20 hover:text-primary flex size-4 items-center justify-center rounded text-xs font-bold transition-colors">
        −
      </button>
    </div>
  );
}

function IconExportSVG() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

interface PlotWrapperProps { plot: PlotState }

export default function PlotWrapper({ plot }: PlotWrapperProps) {
  const studioFiles      = useStore((s) => s.studioFiles);
  const studioOperations = useStore((s) => s.studioOperations);
  const studioTransforms = useStore((s) => s.studioTransforms);
  const fftSampleRateOverride = useStore((s) => s.fftSampleRateOverride);
  const adjData = useStore((s) => s.adjData);
  const webglAvailable = useStore((s) => s.webglAvailable);
  const removeStudioPlot = useStore((s) => s.removeStudioPlot);
  const renameStudioPlot = useStore((s) => s.renameStudioPlot);

  const chartRef     = useRef<PlotlyChartHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [plotHeight, setPlotHeight] = useState(500);
  const [showStats, setShowStats]   = useState(false);

  // Inline rename
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName]     = useState(plot.name);

  const startRename = () => { setDraftName(plot.name); setEditingName(true); };
  const commitRename = () => {
    const t = draftName.trim();
    if (t && t !== plot.name) renameStudioPlot(plot.id, t);
    setEditingName(false);
  };

  const hasRightAxis = plot.signals.some((s) => s.yAxis === "right");
  const hasFFT       = plot.signals.some((s) => s.showFFT);
  const signalCount  = plot.signals.length;

  // Units are only meaningful for raw (non-FFT) traces — an FFT'd signal
  // plots magnitude, not its source unit.
  const axisUnits = useMemo(() => {
    const leftList  = plot.signals.filter((s) => s.yAxis === "left"  && !s.showFFT).map((s) => getSignalUnits(adjData, s.signalId));
    const rightList = plot.signals.filter((s) => s.yAxis === "right" && !s.showFFT).map((s) => getSignalUnits(adjData, s.signalId));
    return {
      left: commonUnits(leftList),
      right: commonUnits(rightList),
      leftMismatch: unitsMismatch(leftList),
      rightMismatch: unitsMismatch(rightList),
    };
  }, [plot.signals, adjData]);
  const hasUnitsMismatch = axisUnits.leftMismatch || axisUnits.rightMismatch;

  const traces = useMemo<Plotly.Data[]>(
    () =>
      plot.signals.flatMap((sig, idx) => {
        const data = getSignalData(sig.signalId, { studioFiles, studioOperations, studioTransforms });
        if (!data || data.length < 2) return [];
        const signal = studioFiles.get(sig.signalId) ?? studioOperations.get(sig.signalId) ?? studioTransforms.get(sig.signalId);
        let name = getSignalName(adjData, sig.signalId) ?? displayName(signal?.name ?? sig.signalId);
        const color = resolveSignalColor(sig.color, idx);
        // Axis title can't show a unit when signals on it disagree — put each
        // signal's own unit in the legend instead so it's still visible.
        const axisMismatch = sig.yAxis === "right" ? axisUnits.rightMismatch : axisUnits.leftMismatch;
        if (axisMismatch && !sig.showFFT) {
          const unit = getSignalUnits(adjData, sig.signalId);
          if (unit) name = `${name} (${unit})`;
        }
        if (sig.showFFT) {
          const fftData = computeFFT(data, fftSampleRateOverride);
          return [{
            x: fftData.map((p) => p.frequency),
            y: fftData.map((p) => p.magnitude),
            type: webglAvailable && fftData.length > GL_POINT_THRESHOLD ? ("scattergl" as const) : ("scatter" as const),
            mode: "lines" as const,
            name: `${name} (FFT)`, line: { width: 2, color },
            yaxis: sig.yAxis === "right" ? ("y2" as const) : ("y" as const),
          }];
        }
        return [{
          x: data.map((p) => p.time), y: data.map((p) => p.value),
          type: webglAvailable && data.length > GL_POINT_THRESHOLD ? ("scattergl" as const) : ("scatter" as const),
          mode: "lines" as const,
          name, line: { width: 2.5, color },
          yaxis: sig.yAxis === "right" ? ("y2" as const) : ("y" as const),
        }];
      }),
    [plot.signals, studioFiles, studioOperations, studioTransforms, fftSampleRateOverride, webglAvailable, adjData, axisUnits],
  );

  const hasTraces = traces.length > 0;

  const layout = useMemo<Partial<Plotly.Layout>>(
    () => {
      const leftUnits  = axisUnits.left;
      const rightUnits = axisUnits.right;

      const base: Partial<Plotly.Layout> = {
        autosize: true,
        // Preserve zoom/pan across data changes (adding signals, stats, etc.);
        // reset only when the X-axis meaning flips between time and frequency.
        uirevision: hasFFT ? `${plot.id}:fft` : plot.id,
        paper_bgcolor: "white", plot_bgcolor: "white",
        font: { color: "#000000", family: "Computer Modern, Latin Modern Math, Times New Roman, serif", size: 14 },
        // Plot title stays editable (click-to-enter placeholder); the subtitle
        // line is explicitly blanked so it doesn't show its own placeholder.
        title: { subtitle: { text: "" } },
        xaxis: {
          title: { text: hasFFT ? "Frequency (Hz)" : "Time (ms)", font: { size: 16, color: "#000000" } },
          gridcolor: "#e0e0e0", linecolor: "#000000", linewidth: 1.5, mirror: true,
          ticks: "outside", tickwidth: 1.5, tickcolor: "#000000", color: "#000000",
          showline: true, zeroline: false, fixedrange: false,
          exponentformat: "power", separatethousands: true,
        },
        yaxis: {
          title: {
            text: hasRightAxis
              ? `Value (Left${leftUnits ? `, ${leftUnits}` : ""})`
              : `Value${leftUnits ? ` (${leftUnits})` : ""}`,
            font: { size: 16, color: hasRightAxis ? "#1f77b4" : "#000000" },
          },
          gridcolor: "#e0e0e0", linecolor: hasRightAxis ? "#1f77b4" : "#000000", linewidth: 1.5, mirror: !hasRightAxis,
          ticks: "outside", tickwidth: 1.5, tickcolor: hasRightAxis ? "#1f77b4" : "#000000", color: hasRightAxis ? "#1f77b4" : "#000000",
          showline: true, zeroline: false, fixedrange: false,
          exponentformat: "power", separatethousands: true,
        },
        margin: { l: 80, r: hasRightAxis ? 80 : 40, t: 40, b: 130 },
        // Unified hover: one label per signal at the same X — much easier to
        // compare synchronized measurements than per-point "closest" mode.
        hovermode: "x unified",
        hoverlabel: {
          bgcolor: "rgba(255,255,255,0.97)",
          bordercolor: "#000000",
          font: { family: "Computer Modern, Latin Modern Math, Times New Roman, serif", size: 12, color: "#000000" },
        },
        showlegend: true,
        legend: {
          bgcolor: "rgba(255,255,255,0.95)", bordercolor: "#000000", borderwidth: 1, font: { size: 13, color: "#000000" },
          orientation: "h", x: 1, xanchor: "right", y: -0.35, yanchor: "top",
        },
      };
      if (hasRightAxis) {
        base.yaxis2 = {
          title: { text: `Value (Right${rightUnits ? `, ${rightUnits}` : ""})`, font: { size: 16, color: "#ff7f0e" } },
          overlaying: "y", side: "right", gridcolor: "transparent",
          linecolor: "#ff7f0e", linewidth: 1.5, ticks: "outside", tickwidth: 1.5,
          tickcolor: "#ff7f0e", color: "#ff7f0e", showline: true, zeroline: false, fixedrange: false,
          exponentformat: "power", separatethousands: true,
        };
      }
      return base;
    },
    [hasRightAxis, hasFFT, plot.id, axisUnits],
  );

  // Drag-to-resize
  const isResizing  = useRef(false);
  const startY      = useRef(0);
  const startHeight = useRef(0);

  const onResizeMouseDown = useCallback((e: React.MouseEvent) => {
    isResizing.current  = true;
    startY.current      = e.clientY;
    startHeight.current = containerRef.current?.offsetHeight ?? plotHeight;
    e.preventDefault();
  }, [plotHeight]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      setPlotHeight(Math.max(300, startHeight.current + (e.clientY - startY.current)));
    };
    const onUp = () => { isResizing.current = false; };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  // Re-render the stats panel whenever the user zooms/pans the chart, so the
  // "visible range" statistics track the current viewport live.
  const [, setStatsTick] = useState(0);
  useEffect(() => {
    if (!showStats || !hasTraces) return;
    const div = chartRef.current?.getDiv() as PlotlyEventDiv | null | undefined;
    if (!div?.on) return;
    const handler = () => setStatsTick((t) => t + 1);
    div.on("plotly_relayout", handler);
    return () => div.removeAllListeners?.("plotly_relayout");
  }, [showStats, hasTraces]);

  const zoomAxis = useCallback((axis: "x" | "y1" | "y2", direction: "in" | "out") => {
    const div = chartRef.current?.getDiv();
    if (!div) return;
    const gd = div as Plotly.PlotlyHTMLElement & { _fullLayout: Record<string, { range?: number[] }> };
    const factor   = direction === "in" ? 0.7 : 1.4;
    const axisKey  = axis === "x" ? "xaxis" : axis === "y1" ? "yaxis" : "yaxis2";
    const rangeKey = axis === "x" ? "xaxis.range" : axis === "y1" ? "yaxis.range" : "yaxis2.range";
    const range = gd._fullLayout[axisKey]?.range;
    if (!range) return;
    const center = (range[0] + range[1]) / 2;
    const half   = ((range[1] - range[0]) / 2) * factor;
    Plotly.relayout(div, { [rangeKey]: [center - half, center + half] });
  }, []);

  const resetZoom = useCallback(() => {
    const div = chartRef.current?.getDiv();
    if (!div) return;
    Plotly.relayout(div, { "xaxis.autorange": true, "yaxis.autorange": true, "yaxis2.autorange": true });
  }, []);

  const exportSVG = () => {
    const div = chartRef.current?.getDiv();
    if (!div) return;
    Plotly.toImage(div, { format: "svg", width: 1200, height: 800 }).then((url) => {
      const a = document.createElement("a");
      a.href = url; a.download = `${plot.name}_${Date.now()}.svg`; a.click();
    });
  };

  const exportPNG = () => {
    const div = chartRef.current?.getDiv();
    if (!div) return;
    Plotly.downloadImage(div, { format: "png", width: 2400, height: 1600, scale: 2, filename: `${plot.name}_${Date.now()}` });
  };

  const statsData = useMemo(
    () => plot.signals.map((sig, idx) => {
      const data   = getSignalData(sig.signalId, { studioFiles, studioOperations, studioTransforms });
      const signal = studioFiles.get(sig.signalId) ?? studioOperations.get(sig.signalId) ?? studioTransforms.get(sig.signalId);
      return { signalId: sig.signalId, name: displayName(signal?.name ?? sig.signalId), data, color: resolveSignalColor(sig.color, idx) };
    }),
    [plot.signals, studioFiles, studioOperations, studioTransforms],
  );

  const getVisibleRange = useCallback((): [number, number] | null => {
    const div = chartRef.current?.getDiv();
    if (!div) return null;
    const gd = div as Plotly.PlotlyHTMLElement & { _fullLayout: Record<string, { range?: number[] }> };
    const range = gd._fullLayout["xaxis"]?.range;
    if (!range || range.length < 2) return null;
    return [Math.min(range[0], range[1]), Math.max(range[0], range[1])];
  }, []);

  return (
    <div className="bg-card overflow-hidden rounded-xl border shadow-md transition-shadow hover:shadow-lg">
      {/* Gradient accent strip */}
      <div className="from-primary/80 to-primary/20 h-[3px] bg-gradient-to-r" />

      {/* Header */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <Activity className="text-primary size-4 shrink-0" />

          {editingName ? (
            <Input
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") setEditingName(false);
              }}
              className="h-6 w-44 px-2 text-sm shadow-none"
              aria-label="Plot name"
            />
          ) : (
            <button
              type="button"
              onDoubleClick={startRename}
              className="group/name flex min-w-0 items-center gap-1.5"
              title="Double-click to rename"
            >
              <span className="text-foreground truncate text-sm font-semibold">{plot.name}</span>
              <Pencil
                onClick={startRename}
                className="text-muted-foreground size-3 shrink-0 cursor-pointer opacity-0 transition-opacity hover:!opacity-100 group-hover/name:opacity-60"
              />
            </button>
          )}

          {signalCount > 0 && (
            <span className="bg-primary/15 text-primary shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium">
              {signalCount} signal{signalCount !== 1 ? "s" : ""}
            </span>
          )}

          {hasUnitsMismatch && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-yellow-500/15 px-2 py-0.5 text-[10px] font-medium text-yellow-600 dark:text-yellow-400">
                  <AlertTriangle className="size-3" />
                  Units mismatch
                </span>
              </TooltipTrigger>
              <TooltipContent>Signals sharing an axis have different units — the axis title omits units</TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          {/* Zoom cluster — only meaningful with traces */}
          {hasTraces && (
            <div className="bg-muted/40 flex items-center gap-1 rounded-lg border px-1.5 py-1">
              <ZoomGroup label="Y◀" axis="y1" onZoom={zoomAxis} />
              {hasRightAxis && <ZoomGroup label="Y▶" axis="y2" onZoom={zoomAxis} />}
              <ZoomGroup label="X" axis="x" onZoom={zoomAxis} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-xs" onClick={resetZoom} aria-label="Reset zoom"
                    className="text-muted-foreground hover:text-primary size-5">
                    <RefreshCw className="size-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset zoom</TooltipContent>
              </Tooltip>
            </div>
          )}

          <Button
            variant={showStats ? "default" : "outline"}
            size="xs"
            onClick={() => setShowStats((v) => !v)}
            disabled={!hasTraces}
            className="gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6"  y1="20" x2="6"  y2="14"/>
            </svg>
            Stats
          </Button>

          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-xs" onClick={exportSVG} disabled={!hasTraces}
                  aria-label="Export SVG" className="text-muted-foreground hover:text-foreground">
                  <IconExportSVG />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export SVG</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-xs" onClick={exportPNG} disabled={!hasTraces}
                  aria-label="Export PNG" className="text-muted-foreground hover:text-foreground">
                  <IconDownload />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export PNG (2×)</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="mx-0.5 h-5" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-xs" onClick={() => removeStudioPlot(plot.id)}
                aria-label="Delete plot"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete plot</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {hasTraces ? (
        // Chart — white canvas kept intentionally for the academic/LaTeX export style
        <div ref={containerRef} className="relative bg-white" style={{ height: plotHeight }}>
          <PlotlyChart ref={chartRef} traces={traces} layout={layout} config={PLOTLY_CONFIG} style={{ height: "100%" }} />
          <div
            onMouseDown={onResizeMouseDown}
            className="hover:bg-primary/10 group absolute inset-x-0 bottom-0 flex h-3 cursor-ns-resize items-center justify-center"
          >
            <div className="bg-border group-hover:bg-primary/50 h-0.5 w-12 rounded-full transition-colors" />
          </div>
        </div>
      ) : (
        <div className="border-muted-foreground/20 bg-muted/20 m-4 mt-1 flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed">
          <Activity className="text-muted-foreground/40 size-6" />
          <p className="text-muted-foreground text-xs">
            No signals to display — assign one from the <span className="text-foreground font-medium">Plots</span> panel
          </p>
        </div>
      )}

      {showStats && hasTraces && (
        <StatsPanel signalData={statsData} getVisibleRange={getVisibleRange} onClose={() => setShowStats(false)} />
      )}
    </div>
  );
}
