import { useStore } from "../../../store/store";
import PlotWrapper from "./PlotWrapper";

function EmptyState() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8 px-8 py-12">
      {/* Waveform illustration */}
      <div className="flex items-end justify-center gap-1" style={{ height: 56 }}>
        {[0.3, 0.6, 1, 0.8, 0.45, 0.9, 0.55, 0.7, 0.35, 0.65, 1, 0.5].map((h, i) => (
          <div
            key={i}
            className="bg-primary/40 w-2 rounded-t"
            style={{ height: `${h * 100}%` }}
          />
        ))}
      </div>

      {/* NOTE: the theme's --spacing-sm/md tokens hijack Tailwind's named
          max-w-sm/md sizes (8px/16px!), so explicit rem values are required */}
      <div className="w-full max-w-[24rem] text-center">
        <h2 className="text-foreground mb-2 text-xl font-semibold">No plots yet</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          All session series are ready to plot — use the{" "}
          <span className="text-foreground font-medium">right panel</span> to add a plot and assign signals.
        </p>
      </div>

      {/* Steps */}
      <div className="border-border bg-card/60 flex w-full max-w-[28rem] items-start justify-around gap-2 rounded-xl border px-6 py-5 shadow-sm">
        {[
          { step: "1", label: "Add plot",      desc: "Toolbar or Plots panel" },
          { step: "2", label: "Assign series", desc: "Any series, grouped by board" },
          { step: "3", label: "Compose",       desc: "Derive new series with ∑ or 𝑓" },
        ].map(({ step, label, desc }, idx) => (
          <div key={step} className="flex flex-col items-center gap-2 text-center">
            <div className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-full text-sm font-bold">
              {step}
            </div>
            <span className="text-foreground text-xs font-semibold">{label}</span>
            <span className="text-muted-foreground text-[10px] leading-tight">{desc}</span>
            {idx < 2 && (
              <div className="text-muted-foreground/40 hidden text-lg sm:block">→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlotsArea() {
  const studioPlots = useStore((s) => s.studioPlots);
  const plots = Array.from(studioPlots.values());
  const visiblePlots = plots.filter((plot) => !plot.hidden);

  if (plots.length === 0) return <EmptyState />;

  return (
    <div className="flex flex-col gap-5 p-4">
      {visiblePlots.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          All plots are hidden — unhide one from the right panel to see it here.
        </p>
      ) : (
        visiblePlots.map((plot) => <PlotWrapper key={plot.id} plot={plot} />)
      )}
    </div>
  );
}
