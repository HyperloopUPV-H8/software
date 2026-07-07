// Simple mode — Plot Studio. Signals are loaded from the left app sidebar
// (Plot Studio Series group); plots and derived signals are managed in the
// right studio panel. The toolbar shows live counts and quick actions.
import { Button, Separator } from "@workspace/ui/components";
import { PanelRight, Plus } from "@workspace/ui/icons";
import { cn } from "@workspace/ui/lib";
import { useState } from "react";
import { useStore } from "../../store/store";
import PlotsArea from "./plots/PlotsArea";
import StudioSidebar from "./sidebar/StudioSidebar";

export default function PlotStudio() {
  const [collapsed, setCollapsed] = useState(false);
  const seriesCount = useStore((s) =>
    Object.values(s.availableSeries).reduce((n, ids) => n + ids.length, 0),
  );
  const plotCount = useStore((s) => s.studioPlots.size);
  const addStudioPlot = useStore((s) => s.addStudioPlot);

  return (
    // min-h-full fills the scrollable parent without a h-full/overflow conflict
    <div className="bg-background text-foreground flex min-h-full">
      {/* Main content column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Toolbar — sticky inside the app scroll container */}
        <div className="bg-background/90 sticky top-0 z-10 flex h-12 shrink-0 items-center gap-3 border-b px-4 backdrop-blur">
          <span className="text-muted-foreground text-xs tabular-nums">
            {seriesCount} series available
            <span className="text-muted-foreground/50 mx-1.5">·</span>
            {plotCount} plot{plotCount !== 1 && "s"}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={addStudioPlot}>
              <Plus className="mr-1 size-3.5" />
              Add Plot
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Toggle studio panel"
              title="Toggle studio panel"
            >
              <PanelRight className={cn("size-4 transition-colors", !collapsed && "text-primary")} />
            </Button>
          </div>
        </div>

        <PlotsArea />
      </div>

      <StudioSidebar collapsed={collapsed} />
    </div>
  );
}
