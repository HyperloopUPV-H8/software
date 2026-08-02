// One plot card: header (rename, zoom, stats, export, delete), Plotly chart,
// drag-to-resize handle and an optional statistics panel.
// Trace colors are pinned via lib/plotStudio/palette so sidebar chips and
// stats headers can mirror the exact color of each curve.
import { useDroppable } from "@dnd-kit/core";
import {
  Button,
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  Input,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components";
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  Pencil,
  RefreshCw,
  Trash2,
} from "@workspace/ui/icons";
import { cn } from "@workspace/ui/lib";
import Plotly from "plotly.js-dist";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { decimateLTTB } from "../../../lib/plotStudio/decimate";
import { computeFFT } from "../../../lib/plotStudio/fft";
import { resolveSignalColor } from "../../../lib/plotStudio/palette";
import { buildPlotLayout, getPlotlyTheme } from "../../../lib/plotStudio/plotlyTheme";
import { lowerBound, upperBound } from "../../../lib/plotStudio/range";
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
  toImageButtonOptions: { format: "png", width: 1200, height: 800, scale: 1 },
};

// Above this point count, decimate before handing points to Plotly (always
// SVG scatter — see the comment in the traces useMemo below for why not GL).
// A full-resolution SVG path with hundreds of thousands of vertices
// is what actually freezes the tab; ~8k is comfortably smooth to paint/pan
// and visually indistinguishable at typical screen widths.
const DECIMATE_THRESHOLD = 8_000;

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
  const removeStudioPlot = useStore((s) => s.removeStudioPlot);
  const renameStudioPlot = useStore((s) => s.renameStudioPlot);
  const isDarkMode = useStore((s) => s.isDarkMode);
  const toggleStudioPlotFFT = useStore((s) => s.toggleStudioPlotFFT);

  const chartRef     = useRef<PlotlyChartHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [plotHeight, setPlotHeight] = useState(500);
  const [showStats, setShowStats]   = useState(false);
  const [collapsed, setCollapsed]   = useState(false);
  // Current X-axis viewport, tracked (debounced) from Plotly relayout events.
  // Drives both zoom-adaptive decimation (traces useMemo) and the Stats panel.
  const [visibleRange, setVisibleRange] = useState<[number, number] | null>(null);

  // Drop target for signals dragged from the left Series sidebar — assignment
  // itself happens centrally in useSignalDnd's handleDragEnd (AppLayout.tsx).
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: plot.id });

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
  const hasFFT       = plot.showFFT;
  const signalCount  = plot.signals.length;

  // Units are only meaningful in time-domain mode — an FFT'd plot shows
  // magnitude, not any signal's source unit.
  const axisUnits = useMemo(() => {
    if (hasFFT) return { left: undefined, right: undefined, leftMismatch: false, rightMismatch: false };
    const leftList  = plot.signals.filter((s) => s.yAxis === "left").map((s) => getSignalUnits(adjData, s.signalId));
    const rightList = plot.signals.filter((s) => s.yAxis === "right").map((s) => getSignalUnits(adjData, s.signalId));
    return {
      left: commonUnits(leftList),
      right: commonUnits(rightList),
      leftMismatch: unitsMismatch(leftList),
      rightMismatch: unitsMismatch(rightList),
    };
  }, [plot.signals, adjData, hasFFT]);
  const hasUnitsMismatch = axisUnits.leftMismatch || axisUnits.rightMismatch;

  const getVisibleRange = useCallback((): [number, number] | null => {
    const div = chartRef.current?.getDiv();
    if (!div) return null;
    const gd = div as Plotly.PlotlyHTMLElement & { _fullLayout: Record<string, { range?: number[] }> };
    const range = gd._fullLayout["xaxis"]?.range;
    if (!range || range.length < 2) return null;
    return [Math.min(range[0], range[1]), Math.max(range[0], range[1])];
  }, []);

  const traces = useMemo<Plotly.Data[]>(
    () =>
      plot.signals.flatMap((sig, idx) => {
        const data = getSignalData(sig.signalId, { studioFiles, studioOperations, studioTransforms });
        if (!data || data.value.length < 2) return [];
        const signal = studioFiles.get(sig.signalId) ?? studioOperations.get(sig.signalId) ?? studioTransforms.get(sig.signalId);
        let name = getSignalName(adjData, sig.signalId) ?? displayName(signal?.name ?? sig.signalId);
        const color = resolveSignalColor(sig.color, idx);
        // Axis title can't show a unit when signals on it disagree — put each
        // signal's own unit in the legend instead so it's still visible.
        const axisMismatch = sig.yAxis === "right" ? axisUnits.rightMismatch : axisUnits.leftMismatch;
        if (axisMismatch && !hasFFT) {
          const unit = getSignalUnits(adjData, sig.signalId);
          if (unit) name = `${name} (${unit})`;
        }

        let xArr: Float64Array;
        let yArr: Float64Array;
        if (hasFFT) {
          const fftResult = computeFFT(data, fftSampleRateOverride);
          xArr = fftResult.frequency;
          yArr = fftResult.magnitude;
        } else {
          xArr = data.time;
          yArr = data.value;
        }

        // Slice to the current zoom window, then decimate for rendering.
        // Always SVG scatter, never scattergl — decimation already bounds
        // the point count sent to Plotly, so WebGL's raw point-count
        // headroom brings nothing, and this user's environment can't
        // sustain a WebGL context at all (immediate "context was lost").
        let sliceStart = 0;
        let sliceEnd = xArr.length;
        if (visibleRange) {
          sliceStart = lowerBound(xArr, visibleRange[0]);
          sliceEnd = upperBound(xArr, visibleRange[1]);
        }

        let renderX = xArr.subarray(sliceStart, sliceEnd);
        let renderY = yArr.subarray(sliceStart, sliceEnd);
        if (renderX.length > DECIMATE_THRESHOLD) {
          const decimated = decimateLTTB(renderX, renderY, DECIMATE_THRESHOLD);
          renderX = decimated.time;
          renderY = decimated.value;
        }

        const traceType = "scatter" as const;

        if (hasFFT) {
          return [{
            x: renderX, y: renderY,
            type: traceType,
            mode: "lines" as const,
            name: `${name} (FFT)`, line: { width: 2, color },
            yaxis: sig.yAxis === "right" ? ("y2" as const) : ("y" as const),
          }];
        }
        return [{
          x: renderX, y: renderY,
          type: traceType,
          mode: "lines" as const,
          name, line: { width: 2.5, color },
          yaxis: sig.yAxis === "right" ? ("y2" as const) : ("y" as const),
        }];
      }),
    [plot.signals, studioFiles, studioOperations, studioTransforms, fftSampleRateOverride, adjData, axisUnits, hasFFT, visibleRange],
  );

  const hasTraces = traces.length > 0;

  const layout = useMemo<Partial<Plotly.Layout>>(
    () => buildPlotLayout({
      theme: getPlotlyTheme(isDarkMode),
      hasFFT, hasRightAxis, plotId: plot.id,
      leftUnits: axisUnits.left, rightUnits: axisUnits.right,
    }),
    [hasRightAxis, hasFFT, plot.id, axisUnits, isDarkMode],
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

  // Track the visible X range whenever the user zooms/pans, so decimation and
  // the Stats panel both track the current viewport live. Debounced — relayout
  // fires many times/sec during a drag, and recomputing on every tick is what
  // made interaction janky/unresponsive. Runs regardless of whether Stats is
  // open, since decimation needs this too.
  useEffect(() => {
    if (!hasTraces) return;
    const div = chartRef.current?.getDiv() as PlotlyEventDiv | null | undefined;
    if (!div?.on) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const handler = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setVisibleRange(getVisibleRange()), 200);
    };
    div.on("plotly_relayout", handler);
    return () => {
      if (timer) clearTimeout(timer);
      div.removeAllListeners?.("plotly_relayout");
    };
  }, [hasTraces, getVisibleRange]);

  // Time (ms) and frequency (Hz) are unrelated axes — a range captured in one
  // mode must not be reused to slice the other after toggling FFT. Plotly's
  // own uirevision-driven zoom reset on mode switch is an internal `react()`
  // reconciliation, not a user interaction, so it never fires plotly_relayout.
  // Reset during render (not an effect) per React's "adjusting state when a
  // prop changes" pattern — avoids an extra cascading render.
  const [prevHasFFT, setPrevHasFFT] = useState(hasFFT);
  if (prevHasFFT !== hasFFT) {
    setPrevHasFFT(hasFFT);
    setVisibleRange(null);
  }

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

  // Exports always render in the light/academic theme regardless of the
  // on-screen app theme (publication-figure look), but keep whatever
  // zoom/pan range is currently visible rather than autoranging to all data.
  const buildExportFigure = () => {
    const div = chartRef.current?.getDiv();
    if (!div) return null;
    const gd = div as unknown as Plotly.PlotlyHTMLElement & { _fullLayout: Record<string, { range?: number[] }> };
    const exportLayout = buildPlotLayout({
      theme: getPlotlyTheme(false),
      hasFFT, hasRightAxis, plotId: plot.id,
      leftUnits: axisUnits.left, rightUnits: axisUnits.right,
    });
    const xRange  = gd._fullLayout["xaxis"]?.range;
    const yRange  = gd._fullLayout["yaxis"]?.range;
    const y2Range = gd._fullLayout["yaxis2"]?.range;
    if (xRange) exportLayout.xaxis = { ...exportLayout.xaxis, range: xRange, autorange: false };
    if (yRange) exportLayout.yaxis = { ...exportLayout.yaxis, range: yRange, autorange: false };
    if (y2Range && exportLayout.yaxis2) exportLayout.yaxis2 = { ...exportLayout.yaxis2, range: y2Range, autorange: false };
    return { data: gd.data, layout: exportLayout };
  };

  const exportPNG = () => {
    const figure = buildExportFigure();
    if (!figure) return;
    Plotly.downloadImage(figure, { format: "png", width: 2400, height: 1600, scale: 2, filename: `${plot.name}_${Date.now()}` });
  };

  const statsData = useMemo(
    () => plot.signals.map((sig, idx) => {
      const data   = getSignalData(sig.signalId, { studioFiles, studioOperations, studioTransforms });
      const signal = studioFiles.get(sig.signalId) ?? studioOperations.get(sig.signalId) ?? studioTransforms.get(sig.signalId);
      const name = getSignalName(adjData, sig.signalId) ?? displayName(signal?.name ?? sig.signalId);
      return { signalId: sig.signalId, name, data, color: resolveSignalColor(sig.color, idx) };
    }),
    [plot.signals, studioFiles, studioOperations, studioTransforms, adjData],
  );

  return (
    <ContextMenu>
    <ContextMenuTrigger asChild>
    <div
      ref={setDropRef}
      className={cn(
        "bg-card overflow-hidden rounded-xl border shadow-md transition-shadow hover:shadow-lg",
        isOver && "ring-primary ring-2 ring-offset-2",
      )}
    >
      {/* Gradient accent strip */}
      <div className="from-primary/80 to-primary/20 h-[3px] bg-gradient-to-r" />

      {/* Header */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-2.5">
        <Button variant="ghost" size="icon-sm" onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand plot" : "Collapse plot"}
          className="text-muted-foreground hover:text-foreground hover:bg-muted -ml-1.5 shrink-0">
          <ChevronDown className={`size-5 transition-transform ${collapsed ? "-rotate-90" : ""}`} />
        </Button>

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
                aria-label="Close plot"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Close plot</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Kept mounted (not conditionally removed) while collapsed, so Plotly's
          zoom/pan state and WebGL context survive expand/collapse. */}
      <div className={collapsed ? "hidden" : undefined}>
        {hasTraces ? (
          // Chart canvas follows app dark mode; exports stay pinned to the
          // light/academic theme regardless (see buildExportFigure above).
          <div ref={containerRef} className="relative" style={{ height: plotHeight, backgroundColor: isDarkMode ? "#181818" : "white" }}>
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
          <StatsPanel signalData={statsData} visibleRange={visibleRange} onClose={() => setShowStats(false)} />
        )}
      </div>
    </div>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem onClick={startRename}>
        <Pencil className="size-3.5" />
        Rename
      </ContextMenuItem>
      <ContextMenuCheckboxItem checked={plot.showFFT} onCheckedChange={() => toggleStudioPlotFFT(plot.id)}>
        Frequency spectrum (FFT)
      </ContextMenuCheckboxItem>
      <ContextMenuItem onClick={() => setCollapsed((v) => !v)}>
        <ChevronDown className={`size-3.5 transition-transform ${collapsed ? "-rotate-90" : ""}`} />
        {collapsed ? "Expand" : "Collapse"}
      </ContextMenuItem>
      <ContextMenuItem onClick={resetZoom} disabled={!hasTraces}>
        <RefreshCw className="size-3.5" />
        Reset Zoom
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuCheckboxItem checked={showStats} onCheckedChange={() => setShowStats((v) => !v)} disabled={!hasTraces}>
        Show Stats
      </ContextMenuCheckboxItem>
      <ContextMenuItem onClick={exportPNG} disabled={!hasTraces}>
        <IconDownload />
        Export PNG
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive" onClick={() => removeStudioPlot(plot.id)}>
        <Trash2 className="size-3.5" />
        Close
      </ContextMenuItem>
    </ContextMenuContent>
    </ContextMenu>
  );
}
