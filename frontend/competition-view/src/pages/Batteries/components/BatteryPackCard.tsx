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
import useMeasurement from "../../../hooks/useMeasurement";
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

const CellTile = ({ cellNum, value }: { cellNum: number; value: number | undefined }) => {
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
};

/* ─── Pack strip ─────────────────────────────────────────────────────────── */

/**
 * One horizontal strip per battery group: summary rail on the left, its
 * 12 cells laid out in a single row so every cell stays wide and legible.
 * Eight strips stacked fill the page without scrolling.
 */
const BatteryPackCard = ({ packNumber }: BatteryPackCardProps) => {
  const keys = hvbmsPack(packNumber);

  const voltage = useMeasurement(BOARDS.HVBMS, keys.voltage);
  const temp1   = useMeasurement(BOARDS.HVBMS, keys.temps[0]);
  const temp2   = useMeasurement(BOARDS.HVBMS, keys.temps[1]);
  const temp3   = useMeasurement(BOARDS.HVBMS, keys.temps[2]);
  const temp4   = useMeasurement(BOARDS.HVBMS, keys.temps[3]);
  const numericTemps = [temp1, temp2, temp3, temp4].filter((t): t is number => typeof t === "number");
  const tempMax = numericTemps.length > 0 ? Math.max(...numericTemps) : undefined;

  // Read every cell once here (not inside each tile) so the pack-level
  // health accent and the tiles themselves share a single subscription.
  const cellValues = useStore(
    useShallow((s) => keys.cells.map((key) => s.telemetry[BOARDS.HVBMS]?.[key] as number | undefined)),
  );
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
          <span className="text-foreground font-semibold">{fmt(voltage)}</span> V
          {" · "}
          <span className="text-foreground font-semibold">{fmt(tempMax)}</span> °C
        </span>
      </div>

      {/* All 12 cells in a single row */}
      <div className="grid min-h-0 min-w-0 flex-1 grid-cols-12 gap-1.5">
        {keys.cells.map((key, i) => (
          <CellTile key={key} cellNum={i + 1} value={cellValues[i]} />
        ))}
      </div>
    </div>
  );
};

export default BatteryPackCard;
