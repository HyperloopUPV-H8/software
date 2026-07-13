import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components";
import { useShallow } from "zustand/react/shallow";
import { formatAxisValue } from "../../../constants/chartConfig";
import { BOARDS, hvbmsPack } from "../../../constants/measurements";
import useMeasurement from "../../../hooks/useMeasurement";
import { useStore } from "../../../store/store";

interface BatteryPackCardProps {
  packNumber: number;
}

const CELL_MIN = 3.0;
const CELL_MAX = 4.2;
const CELL_WARN_LOW  = 3.1;
const CELL_WARN_HIGH = 4.15;

// formatAxisValue keeps the label short (falls back to exponential notation)
// so a garbage/out-of-range sample never blows out a tile's fixed width.
const fmt = (v: number | boolean | string | undefined) =>
  typeof v === "number" ? formatAxisValue(v) : "—";

type CellStatus = "low" | "high" | "ok";

const cellStatus = (v: number | null): CellStatus =>
  v === null ? "ok" : v < CELL_WARN_LOW ? "low" : v > CELL_WARN_HIGH ? "high" : "ok";

/* ─── Individual cell tile ───────────────────────────────────────────────── */

const CellTile = ({ cellNum, value }: { cellNum: number; value: number | undefined }) => {
  const v = typeof value === "number" ? value : null;
  const status = cellStatus(v);
  const fill = v !== null
    ? Math.min(100, Math.max(0, ((v - CELL_MIN) / (CELL_MAX - CELL_MIN)) * 100))
    : 0;

  return (
    <div
      className={`flex min-w-0 flex-col gap-1.5 overflow-hidden rounded-lg border px-2.5 py-2 ${
        status === "low"  ? "border-red-500 bg-red-500/5" :
        status === "high" ? "border-amber-500 bg-amber-500/5" :
                             "border-border"
      }`}
    >
      <span className="text-muted-foreground truncate text-[10px] leading-none">Cell {cellNum}</span>
      <span
        className={`truncate text-sm font-semibold leading-none tabular-nums ${
          status === "low" ? "text-red-500" : status === "high" ? "text-amber-500" : "text-foreground"
        }`}
      >
        {v !== null ? formatAxisValue(v) : "—"}
        <span className="text-muted-foreground ml-0.5 text-[10px] font-normal">V</span>
      </span>
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

/* ─── Pack card ──────────────────────────────────────────────────────────── */

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
    <Card
      className={`gap-0 py-0 ${
        packStatus === "low"  ? "border-red-500/60" :
        packStatus === "high" ? "border-amber-500/60" :
                                 ""
      }`}
    >
      <CardContent className="flex gap-4 p-4">
        {/* Summary rail */}
        <div className="flex w-28 min-w-0 shrink-0 flex-col justify-center gap-3 border-r pr-4">
          <CardHeader className="p-0">
            <CardTitle className="truncate text-base font-semibold">Group {packNumber}</CardTitle>
          </CardHeader>

          <div className="flex min-w-0 flex-col">
            <span className="text-muted-foreground text-[10px] uppercase tracking-widest">Voltage</span>
            <span className="text-foreground truncate text-lg leading-tight font-bold tabular-nums">
              {fmt(voltage)}
              <span className="text-muted-foreground ml-1 text-xs font-normal">V</span>
            </span>
          </div>

          <div className="flex min-w-0 flex-col">
            <span className="text-muted-foreground text-[10px] uppercase tracking-widest">Temp max</span>
            <span className="text-foreground truncate text-lg leading-tight font-semibold tabular-nums">
              {fmt(tempMax)}
              <span className="text-muted-foreground ml-1 text-xs font-normal">°C</span>
            </span>
          </div>
        </div>

        {/* Cell grid: 4 cols × 3 rows */}
        <div className="grid min-w-0 flex-1 grid-cols-4 grid-rows-3 gap-2">
          {keys.cells.map((key, i) => (
            <CellTile key={key} cellNum={i + 1} value={cellValues[i]} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BatteryPackCard;
