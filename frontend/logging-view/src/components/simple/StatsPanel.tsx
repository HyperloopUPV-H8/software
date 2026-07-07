// Statistics panel shown under a plot. Metrics are computed over the visible
// X range only (live — the parent re-renders this panel on every Plotly
// relayout, so zooming/panning updates the numbers immediately).
import { Button, Separator } from "@workspace/ui/components";
import { X } from "@workspace/ui/icons";
import { cn } from "@workspace/ui/lib";
import { computeNoiseStats, estimateNoiseFloor } from "../../lib/plotStudio/stats";
import type { SignalPoint } from "../../types/plotStudio";

interface SignalEntry {
  signalId: string;
  name: string;
  data: SignalPoint[] | null;
  /** Trace color from lib/plotStudio/palette — matches the curve in the chart. */
  color: string;
}

interface StatsPanelProps {
  signalData: SignalEntry[];
  getVisibleRange: () => [number, number] | null;
  onClose: () => void;
}

const STAT_CARDS = [
  { key: "mean",       label: "Mean",          color: "text-foreground",       bg: "bg-muted/40" },
  { key: "std",        label: "Std Dev σ",     color: "text-blue-500",         bg: "bg-blue-500/8" },
  { key: "rms",        label: "RMS",           color: "text-violet-500",       bg: "bg-violet-500/8" },
  { key: "peakToPeak", label: "Peak-to-Peak",  color: "text-amber-500",        bg: "bg-amber-500/8" },
  { key: "min",        label: "Min",           color: "text-emerald-500",      bg: "bg-emerald-500/8" },
  { key: "max",        label: "Max",           color: "text-rose-500",         bg: "bg-rose-500/8" },
  { key: "noiseFloor", label: "Noise Floor σ", color: "text-primary",          bg: "bg-primary/8", primary: true },
  { key: "count",      label: "Samples",       color: "text-muted-foreground", bg: "bg-muted/40", integer: true },
] as const;

// Compact numeric formatting: plain notation in a sane range, scientific
// outside it. Number(toPrecision) round-trips to strip trailing zeros safely.
function fmt(v: number, integer?: boolean): string {
  if (!Number.isFinite(v)) return "—";
  if (integer) return v.toLocaleString();
  const abs = Math.abs(v);
  if (abs !== 0 && (abs >= 1e6 || abs < 1e-4)) return v.toExponential(3);
  return String(Number(v.toPrecision(5)));
}

function StatCard({ label, value, color, bg, primary }: {
  label: string; value: string; color: string; bg: string; primary?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-1 rounded-lg border p-3 transition-shadow hover:shadow-sm", bg, primary && "border-primary/30")}>
      <span className={cn("text-[10px] font-medium uppercase tracking-wide", primary ? color : "text-muted-foreground")}>
        {label}
      </span>
      <span className={cn("truncate font-mono text-sm font-semibold tabular-nums", color)} title={value}>
        {value}
      </span>
    </div>
  );
}

export default function StatsPanel({ signalData, getVisibleRange, onClose }: StatsPanelProps) {
  const range = getVisibleRange();
  const rangeLabel = range ? `${range[0].toFixed(2)} – ${range[1].toFixed(2)} ms` : "full signal";

  return (
    <div className="border-t">
      {/* Header */}
      <div className="from-primary/5 flex items-center justify-between bg-gradient-to-r to-transparent px-4 py-2.5">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="text-primary shrink-0">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6"  y1="20" x2="6"  y2="14"/>
          </svg>
          <span className="text-foreground text-xs font-semibold">Signal Statistics</span>
          <span className="text-muted-foreground hidden text-[10px] sm:inline">— updates with zoom</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-[10px]">
            Range: <span className="text-foreground font-mono font-medium">{rangeLabel}</span>
          </span>
          <Button variant="ghost" size="icon-xs" onClick={onClose} aria-label="Close statistics"
            className="text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-5 p-4">
        {signalData.map(({ signalId, name, data, color }) => {
          if (!data || data.length < 2) return null;
          const filtered = range
            ? data.filter((p) => p.time >= range[0] && p.time <= range[1])
            : data;
          if (filtered.length < 2) return null;

          const stats = computeNoiseStats(filtered);
          const floor = estimateNoiseFloor(filtered);
          if (!stats) return null;

          const values: Record<string, number> = {
            mean: stats.mean, std: stats.std, rms: stats.rms,
            peakToPeak: stats.peakToPeak, min: stats.min, max: stats.max,
            noiseFloor: floor.noiseFloor, count: stats.count,
          };

          return (
            <div key={signalId}>
              <div className="mb-3 flex items-center gap-2">
                {/* Dot matches the trace color in the chart */}
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-foreground text-sm font-semibold">{name}</span>
                <span className="text-muted-foreground text-[11px]">
                  ({filtered.length.toLocaleString()} pts in range)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
                {STAT_CARDS.map(({ key, label, color: cardColor, bg, ...rest }) => (
                  <StatCard
                    key={key}
                    label={label}
                    value={fmt(values[key], "integer" in rest && rest.integer)}
                    color={cardColor}
                    bg={bg}
                    primary={"primary" in rest && rest.primary}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {signalData.every((s) => !s.data || s.data.length < 2) && (
          <div className="text-muted-foreground py-6 text-center text-sm">
            No data to analyze in the current range.
          </div>
        )}
      </div>
    </div>
  );
}
