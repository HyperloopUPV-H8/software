import { memo, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { formatAxisValue } from "../../../constants/chartConfig";
import {
  BOARDS,
  CELL_V_MAX,
  CELL_V_MIN,
  CELL_V_WARN_HIGH,
  CELL_V_WARN_LOW,
  hvbmsPack,
} from "../../../constants/measurements";
import { useStaleFlags } from "../../../hooks/useIsStale";
import { STALE_TEXT_CLASS } from "../../../lib/freshness";
import { useStore } from "../../../store/store";

interface BatteryPackCardProps {
  packNumber: number;
}

// formatAxisValue keeps the label short (falls back to exponential notation)
// so a garbage/out-of-range sample never blows out a tile's fixed width.
const fmt = (v: number | boolean | string | undefined) =>
  typeof v === "number" ? formatAxisValue(v) : "—";

type CellStatus = "low" | "high" | "ok";

const cellStatus = (v: number | null): CellStatus =>
  v === null ? "ok" : v < CELL_V_WARN_LOW ? "low" : v > CELL_V_WARN_HIGH ? "high" : "ok";

/* ─── Individual cell tile ───────────────────────────────────────────────── */

// Memoised so only the cells whose value actually changed re-render.
const CellTile = memo(({ cellNum, value, stale }: { cellNum: number; value: number | undefined; stale: boolean }) => {
  const v = typeof value === "number" ? value : null;
  const status = cellStatus(v);
  const fill = v !== null
    ? Math.min(100, Math.max(0, ((v - CELL_V_MIN) / (CELL_V_MAX - CELL_V_MIN)) * 100))
    : 0;

  return (
    <div
      className={`flex min-w-0 flex-col justify-center gap-1 overflow-hidden rounded-md border px-1.5 py-1 ${
        status === "low"  ? "border-red-500 bg-red-500/5" :
        status === "high" ? "border-amber-500 bg-amber-500/5" :
                             "border-border"
      }`}
    >
      <div className="flex items-baseline justify-between gap-1">
        <span className="text-muted-foreground text-[10px] leading-none">C{cellNum}</span>
        <span
          className={`truncate text-sm font-semibold leading-none tabular-nums ${
            stale ? STALE_TEXT_CLASS :
            status === "low" ? "text-red-500" : status === "high" ? "text-amber-500" : "text-foreground"
          }`}
        >
          {v !== null ? formatAxisValue(v) : "—"}
        </span>
      </div>
      <div className="bg-muted h-1 overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full ${
            status === "low" ? "bg-red-500" : status === "high" ? "bg-amber-500" : "bg-green-500"
          }`}
          style={{ width: `${fill}%` }}
        />
      </div>
    </div>
  );
});

CellTile.displayName = "CellTile";

/* ─── Pack strip ─────────────────────────────────────────────────────────── */

/**
 * One horizontal strip per battery group: summary rail on the left, its
 * 12 cells laid out in a single row so every cell stays wide and legible.
 * Eight strips stacked fill the page without scrolling.
 */
const BatteryPackCard = memo(({ packNumber }: BatteryPackCardProps) => {
  const keys = useMemo(() => hvbmsPack(packNumber), [packNumber]);
  // Same order as the values selector below: voltage, temps 1-4, cells 1-12.
  const ids  = useMemo(() => [keys.voltage, ...keys.temps, ...keys.cells], [keys]);

  // Single consolidated subscription for everything this strip displays
  // (voltage + 4 temps + 12 cells) instead of one subscription per value.
  const values = useStore(
    useShallow((s) => {
      const board = s.telemetry[BOARDS.HVBMS];
      return ids.map((id) => board?.[id]) as (number | undefined)[];
    }),
  );
  const staleFlags = useStaleFlags(BOARDS.HVBMS, ids);

  const voltage    = values[0];
  const temps      = values.slice(1, 5);
  const cellValues = values.slice(5);

  const voltageStale = staleFlags[0];
  const tempStale    = staleFlags.slice(1, 5).some(Boolean);
  const cellStale    = staleFlags.slice(5);

  const numericTemps = temps.filter((t): t is number => typeof t === "number");
  const tempMax = numericTemps.length > 0 ? Math.max(...numericTemps) : undefined;

  const statuses = cellValues.map((v) => cellStatus(typeof v === "number" ? v : null));
  const packStatus: CellStatus = statuses.includes("low") ? "low" : statuses.includes("high") ? "high" : "ok";

  return (
    <div
      className={`bg-card flex min-h-0 flex-1 items-stretch gap-2 rounded-xl border p-2 shadow-sm ${
        packStatus === "low"  ? "border-red-500/60" :
        packStatus === "high" ? "border-amber-500/60" :
                                 ""
      }`}
    >
      {/* Summary rail */}
      <div className="flex w-40 min-w-0 shrink-0 flex-col justify-center gap-0.5 border-r pr-2">
        <span className="truncate text-sm font-semibold leading-tight">Group {packNumber}</span>
        <span className="text-muted-foreground truncate text-xs tabular-nums">
          <span className={`font-semibold ${voltageStale ? STALE_TEXT_CLASS : "text-foreground"}`}>{fmt(voltage)}</span> V
          {" · "}
          <span className={`font-semibold ${tempStale ? STALE_TEXT_CLASS : "text-foreground"}`}>{fmt(tempMax)}</span> °C
        </span>
      </div>

      {/* All 12 cells in a single row */}
      <div className="grid min-h-0 min-w-0 flex-1 grid-cols-12 gap-1.5">
        {keys.cells.map((key, i) => (
          <CellTile key={key} cellNum={i + 1} value={cellValues[i]} stale={cellStale[i]} />
        ))}
      </div>
    </div>
  );
});

BatteryPackCard.displayName = "BatteryPackCard";
export default BatteryPackCard;
