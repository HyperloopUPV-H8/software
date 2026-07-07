// Plot management: create plots, assign any session series (parsed lazily on
// first use) and configure each signal's Y axis and FFT view. The color dot
// on each chip matches the trace color in the chart (lib/plotStudio/palette).
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
import { Activity, Plus, Trash2, X } from "@workspace/ui/icons";
import { cn } from "@workspace/ui/lib";
import { useState } from "react";
import { traceColor } from "../../../lib/plotStudio/palette";
import { useStore } from "../../../store/store";
import { useSignalLoader } from "../hooks/useStudioSignals";
import SignalSelect from "../SignalSelect";

export default function PlotsSection() {
  const studioPlots      = useStore((s) => s.studioPlots);
  const studioFiles      = useStore((s) => s.studioFiles);
  const studioOperations = useStore((s) => s.studioOperations);
  const studioTransforms = useStore((s) => s.studioTransforms);
  const addStudioPlot              = useStore((s) => s.addStudioPlot);
  const removeStudioPlot           = useStore((s) => s.removeStudioPlot);
  const addSignalToStudioPlot      = useStore((s) => s.addSignalToStudioPlot);
  const removeSignalFromStudioPlot = useStore((s) => s.removeSignalFromStudioPlot);
  const updateStudioSignalAxis     = useStore((s) => s.updateStudioSignalAxis);
  const toggleStudioSignalFFT      = useStore((s) => s.toggleStudioSignalFFT);

  const ensureLoaded = useSignalLoader();
  // Plot ids with a CSV parse in flight (shows "Loading…" in the trigger)
  const [assigning, setAssigning] = useState<Set<string>>(new Set());

  const plots = Array.from(studioPlots.values());

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
        <div key={plot.id} className="bg-card overflow-hidden rounded-lg border shadow-sm">
          {/* Plot header */}
          <div className="from-primary/5 flex items-center gap-2 border-b bg-gradient-to-r to-transparent px-3 py-2">
            <div className="bg-primary/20 flex size-4 shrink-0 items-center justify-center rounded-sm">
              <Activity className="text-primary size-3" />
            </div>
            <span className="text-foreground flex-1 truncate text-xs font-semibold">{plot.name}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-xs"
                  onClick={() => removeStudioPlot(plot.id)}
                  aria-label={`Remove ${plot.name}`}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <X className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Remove plot</TooltipContent>
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
                    {/* Trace color dot — matches the curve in the chart */}
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: traceColor(idx) }}
                    />
                    <span className="text-foreground min-w-0 flex-1 truncate text-[11px] font-medium">
                      {shortName(signal?.name ?? sig.signalId)}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <label className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-0.5 text-[10px] transition-colors">
                        <input
                          type="checkbox"
                          checked={sig.showFFT}
                          onChange={(e) => toggleStudioSignalFFT(plot.id, sig.signalId, e.target.checked)}
                          className="accent-primary size-2.5"
                        />
                        FFT
                      </label>
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
