import { Card, CardContent } from "@workspace/ui/components";
import { useEffect, useRef, useState } from "react";
import podIcon from "../../../assets/pod.svg";
import { BOARDS, PCU } from "../../../constants/measurements";
import { TRACK_LENGTH_M } from "../../../constants/track";
import useMeasurement from "../../../hooks/useMeasurement";

/** Number of gaps between distance labels below the track (5 labels total). */
const TICK_COUNT = 4;
const TICKS = Array.from({ length: TICK_COUNT + 1 }, (_, i) => (TRACK_LENGTH_M / TICK_COUNT) * i);

/** Rendered pod icon width in px (h-14 = 56px tall, at the SVG's ~1.76:1 aspect ratio). */
const ICON_WIDTH_PX = 99;

/** Track-position visualizer: the pod icon slides along an empty bordered track. */
const TrackProgress = () => {
  const position = useMeasurement(BOARDS.PCU, PCU.position) as number | undefined;
  const clamped  = typeof position === "number" ? Math.min(TRACK_LENGTH_M, Math.max(0, position)) : 0;
  const pct      = (clamped / TRACK_LENGTH_M) * 100;

  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    if (!trackRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setTrackWidth(entry.contentRect.width);
    });
    observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);

  // Keep the icon's own edges within the track by only sliding its center
  // across the range [iconWidth/2, trackWidth - iconWidth/2].
  const availableWidth = Math.max(trackWidth - ICON_WIDTH_PX, 0);
  const podCenterPx = ICON_WIDTH_PX / 2 + (pct / 100) * availableWidth;

  return (
    <Card className="shrink-0 gap-1 py-2">
      <CardContent className="flex flex-col gap-1 px-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
            Track Position
          </span>
          <span className="text-foreground text-base font-bold tabular-nums">
            {typeof position === "number" ? position.toFixed(1) : "—"}
            <span className="text-muted-foreground ml-0.5 text-sm font-normal">/ {TRACK_LENGTH_M} m</span>
          </span>
        </div>

        <div ref={trackRef} className="relative my-3 h-8 rounded-lg border-2">
          <img
            src={podIcon}
            alt="Pod"
            className="absolute top-1/2 h-14 w-auto -translate-x-1/2 -translate-y-1/2 transition-all"
            style={{ left: `${podCenterPx}px` }}
          />
        </div>

        <div className="flex justify-between">
          {TICKS.map((t) => (
            <span key={t} className="text-muted-foreground text-[10px] tabular-nums">
              {t.toFixed(0)} m
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackProgress;
