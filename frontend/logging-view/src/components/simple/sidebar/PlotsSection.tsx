// Plot management: create plots, assign any session series (parsed lazily on
// first use) and configure each signal's Y axis. FFT is a whole-plot toggle
// (not per-signal) — mixing FFT and time-domain traces on one plot would mean
// two incompatible X-axis semantics sharing one axis. The color dot on each
// chip matches the trace color in the chart (lib/plotStudio/palette).
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components";
import { Activity, Eye, EyeOff, GripVertical, Plus, Trash2, X } from "@workspace/ui/icons";
import { cn } from "@workspace/ui/lib";
import { useState } from "react";
import { resolveSignalColor } from "../../../lib/plotStudio/palette";
import { getSignalName } from "../../../lib/plotStudio/units";
import { useStore } from "../../../store/store";
import { useSignalLoader } from "../hooks/useStudioSignals";
import SignalSelect from "../SignalSelect";

export default function PlotsSection() {
  const studioPlots      = useStore((s) => s.studioPlots);
  const studioFiles      = useStore((s) => s.studioFiles);
  const studioOperations = useStore((s) => s.studioOperations);
  const studioTransforms = useStore((s) => s.studioTransforms);
  const adjData = useStore((s) => s.adjData);
  const addStudioPlot              = useStore((s) => s.addStudioPlot);
  const removeStudioPlot           = useStore((s) => s.removeStudioPlot);
  const toggleStudioPlotHidden     = useStore((s) => s.toggleStudioPlotHidden);
  const reorderStudioPlots         = useStore((s) => s.reorderStudioPlots);
  const addSignalToStudioPlot      = useStore((s) => s.addSignalToStudioPlot);
  const removeSignalFromStudioPlot = useStore((s) => s.removeSignalFromStudioPlot);
  const updateStudioSignalAxis     = useStore((s) => s.updateStudioSignalAxis);
  const toggleStudioPlotFFT        = useStore((s) => s.toggleStudioPlotFFT);
  const updateStudioSignalColor    = useStore((s) => s.updateStudioSignalColor);

  const ensureLoaded = useSignalLoader();
  // Plot ids with a CSV parse in flight (shows "Loading…" in the trigger)
  const [assigning, setAssigning] = useState<Set<string>>(new Set());
  // Drag-to-reorder: id of the plot currently being dragged
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const plots = Array.from(studioPlots.values());

  const handleDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;
    const ids = plots.map((p) => p.id);
    const from = ids.indexOf(draggingId);
    const to = ids.indexOf(targetId);
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    reorderStudioPlots(ids);
    setDraggingId(null);
  };

  const shortName = (id: string) =>
    id.includes("/") ? id.split("/").slice(1).join("/") : id.replace(/\.csv$/, "");

  const assign = async (plotId: string, signalId: string) => {
    setAssigning((prev) => new Set(prev).add(plotId));
    try {
      const data = await ensureLoaded(signalId);
      if (data) addSignalToStudioPlot(plotId, signalId);
    } finally {
      setAssigning((prev) => { const next = new Set(prev); next.delete(plotId); return next; });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Button size="sm" className="w-full" onClick={addStudioPlot}>
        <Plus className="mr-1 size-3.5" />
        Add New Plot
      </Button>

      {plots.length === 0 && (
        <p className="text-muted-foreground py-2 text-center text-[11px]">
          Create a plot, then assign any session series to it
        </p>
      )}

      {plots.map((plot) => (
        <div key={plot.id}
          className={cn(
            "bg-card overflow-hidden rounded-lg border shadow-sm transition-opacity",
            plot.hidden && "opacity-50",
            draggingId === plot.id && "opacity-30",
          )}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(plot.id)}
        >
          {/* Plot header — draggable to reorder plots (reflected in PlotsArea too) */}
          <div
            draggable
            onDragStart={() => setDraggingId(plot.id)}
            onDragEnd={() => setDraggingId(null)}
            className="from-primary/5 flex cursor-grab items-center gap-2 border-b bg-gradient-to-r to-transparent px-3 py-2 active:cursor-grabbing"
          >
            <GripVertical className="text-muted-foreground/50 size-3.5 shrink-0" />
            <div className="bg-primary/20 flex size-4 shrink-0 items-center justify-center rounded-sm">
              <Activity className="text-primary size-3" />
            </div>
            <span className="text-foreground flex-1 truncate text-xs font-semibold">{plot.name}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <label className="text-muted-foreground hover:text-foreground flex shrink-0 cursor-pointer items-center gap-1 text-[10px] transition-colors">
                  <input
                    type="checkbox"
                    checked={plot.showFFT}
                    onChange={() => toggleStudioPlotFFT(plot.id)}
                    className="accent-primary size-3"
                  />
                  FFT
                </label>
              </TooltipTrigger>
              <TooltipContent side="left">
                {plot.showFFT ? "Showing frequency spectrum" : "Showing time-domain"} — applies to every signal in this plot
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-xs"
                  onClick={() => toggleStudioPlotHidden(plot.id)}
                  aria-label={plot.hidden ? `Show ${plot.name}` : `Hide ${plot.name}`}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted">
                  {plot.hidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">{plot.hidden ? "Show plot" : "Hide plot"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-xs"
                  onClick={() => removeStudioPlot(plot.id)}
                  aria-label={`Close ${plot.name}`}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <X className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Close plot</TooltipContent>
            </Tooltip>
          </div>

          {/* Assigned signals */}
          {plot.signals.length > 0 && (
            <div className="flex flex-col gap-1 px-2 py-2">
              {plot.signals.map((sig, idx) => {
                const signal = studioFiles.get(sig.signalId) ?? studioOperations.get(sig.signalId) ?? studioTransforms.get(sig.signalId);
                return (
                  <div key={sig.signalId}
                    className="bg-muted/30 hover:bg-muted/60 group flex items-center gap-2 rounded-md border px-2 py-1.5 transition-colors">
                    {/* Trace color — click to override; matches the curve in the chart */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <input
                          type="color"
                          value={resolveSignalColor(sig.color, idx)}
                          onChange={(e) => updateStudioSignalColor(plot.id, sig.signalId, e.target.value)}
                          aria-label="Signal color"
                          className="size-2.5 shrink-0 cursor-pointer appearance-none rounded-full border-0 bg-transparent p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="left">Signal color</TooltipContent>
                    </Tooltip>
                    <span className="text-foreground min-w-0 flex-1 truncate text-[11px] font-medium">
                      {getSignalName(adjData, sig.signalId) ?? shortName(signal?.name ?? sig.signalId)}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <Select
                        value={sig.yAxis}
                        onValueChange={(v) => updateStudioSignalAxis(plot.id, sig.signalId, v as "left" | "right")}
                      >
                        <SelectTrigger size="sm" className="h-5 w-16 border-0 bg-transparent px-1 text-[10px] shadow-none focus-visible:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">◀ Left</SelectItem>
                          <SelectItem value="right">Right ▶</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon-xs"
                        onClick={() => removeSignalFromStudioPlot(plot.id, sig.signalId)}
                        aria-label="Remove signal from plot"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 size-4 opacity-0 transition-opacity group-hover:opacity-100">
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Assign dropdown — grouped by board, hides already-assigned */}
          <div className={cn("px-2 pb-2", plot.signals.length > 0 ? "border-t pt-1.5" : "pt-2")}>
            <SignalSelect
              value=""
              onValueChange={(id) => assign(plot.id, id)}
              placeholder={assigning.has(plot.id) ? "Loading…" : "+ Assign signal…"}
              exclude={plot.signals.map((s) => s.signalId)}
              size="sm"
              triggerClassName="text-muted-foreground h-7 w-full border-dashed text-[11px] shadow-none"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
