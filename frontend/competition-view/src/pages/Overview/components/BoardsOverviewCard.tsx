import { BatteryFull, Cpu, type LucideIcon, Waves, Zap } from "lucide-react";
import { formatAxisValue } from "../../../constants/chartConfig";
import { BOARDS, HVBMS, LCU, PCU_BOARD, VCU } from "../../../constants/measurements";
import { useIsStale } from "../../../hooks/useIsStale";
import useMeasurement from "../../../hooks/useMeasurement";
import { STALE_BADGE_CLASS, STALE_TEXT_CLASS } from "../../../lib/freshness";
import { stateBadgeClass } from "../../../lib/stateColor";

interface Stat {
  label: string;
  measurementKey: string;
  unit?: string;
  decimals?: number;
  /** Labels for [true, false] — makes boolean measurements read as words instead of "true"/"false". */
  boolLabels?: [string, string];
}

interface BoardRow {
  board: string;
  name: string;
  icon: LucideIcon;
  stateMeasurementKey: string;
  stats: Stat[];
}

const ROWS: BoardRow[] = [
  {
    board: BOARDS.VCU,
    name: "VCU",
    icon: Cpu,
    stateMeasurementKey: VCU.state,
    stats: [
      { label: "SDC",        measurementKey: VCU.sdcClosed,    boolLabels: ["Closed", "Open"] },
      { label: "Brakes",     measurementKey: VCU.brakesStatus },
    ],
  },
  {
    board: BOARDS.HVBMS,
    name: "HVBMS",
    icon: BatteryFull,
    stateMeasurementKey: HVBMS.operationalState,
    stats: [
      { label: "SOC",     measurementKey: HVBMS.soc,              unit: "%" },
      { label: "Pack V",  measurementKey: HVBMS.batteriesVoltage, unit: "V" },
      { label: "Current", measurementKey: HVBMS.currentReading,   unit: "A" },
    ],
  },
  {
    board: BOARDS.PCU,
    name: "PCU",
    icon: Zap,
    stateMeasurementKey: PCU_BOARD.state,
    stats: [
      { label: "Peak I",  measurementKey: PCU_BOARD.peakCurrent, unit: "A" },
      { label: "Freq",    measurementKey: PCU_BOARD.frequency,   unit: "Hz" },
    ],
  },
  {
    board: BOARDS.LCU,
    name: "LCU",
    icon: Waves,
    stateMeasurementKey: LCU.masterState,
    stats: [
      { label: "Slave SM", measurementKey: LCU.slaveState },
    ],
  },
];

const StatItem = ({ board, stat }: { board: string; stat: Stat }) => {
  const raw   = useMeasurement(board, stat.measurementKey);
  const stale = useIsStale(board, stat.measurementKey);
  // Garbage/misdecoded samples can come through as huge magnitudes; fall
  // back to compact/exponential formatting instead of a long digit string.
  const display =
    typeof raw === "number"
      ? Number.isFinite(raw) && Math.abs(raw) !== 0 && (Math.abs(raw) >= 1e6 || Math.abs(raw) < 1e-3)
        ? formatAxisValue(raw)
        : raw.toFixed(stat.decimals ?? 1)
      : typeof raw === "boolean" && stat.boolLabels
        ? stat.boolLabels[raw ? 0 : 1]
        : raw !== undefined
          ? String(raw)
          : "—";

  return (
    <div className="flex items-baseline justify-between gap-2 text-xs whitespace-nowrap">
      <span className="text-muted-foreground">{stat.label}</span>
      <span className={`font-semibold tabular-nums ${stale ? STALE_TEXT_CLASS : "text-foreground"}`}>
        {display}
        {raw !== undefined && stat.unit && (
          <span className="text-muted-foreground ml-0.5">{stat.unit}</span>
        )}
      </span>
    </div>
  );
};

const BoardTile = ({ row }: { row: BoardRow }) => {
  const state      = useMeasurement(row.board, row.stateMeasurementKey);
  const stateStale = useIsStale(row.board, row.stateMeasurementKey);

  return (
    <div className="bg-card flex flex-col gap-1 rounded-xl border p-2 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wider">
          <row.icon className="size-3.5" />
          {row.name}
        </span>
        <span className={`min-w-0 truncate rounded border px-1.5 py-0.5 text-xs font-bold ${stateStale ? STALE_BADGE_CLASS : stateBadgeClass(state)}`}>
          {state !== undefined ? String(state) : "—"}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        {row.stats.map((stat) => (
          <StatItem key={stat.measurementKey} board={row.board} stat={stat} />
        ))}
      </div>
    </div>
  );
};

/**
 * 2×2 grid of per-board state tiles. The tiles are the card surface
 * themselves — no wrapper card or title, to keep the column compact.
 */
const BoardsOverviewCard = () => (
  <div className="grid shrink-0 grid-cols-2 gap-2">
    {ROWS.map((row) => (
      <BoardTile key={row.board} row={row} />
    ))}
  </div>
);

export default BoardsOverviewCard;
