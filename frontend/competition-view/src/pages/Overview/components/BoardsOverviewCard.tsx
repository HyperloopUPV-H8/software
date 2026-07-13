import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components";
import { BOARDS, HVBMS, LCU, PCU_BOARD, VCU } from "../../../constants/measurements";
import useMeasurement from "../../../hooks/useMeasurement";
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
  stateMeasurementKey: string;
  stats: Stat[];
}

const ROWS: BoardRow[] = [
  {
    board: BOARDS.VCU,
    name: "VCU",
    stateMeasurementKey: VCU.state,
    stats: [
      { label: "High pres.", measurementKey: VCU.highPressure, unit: "bar" },
      { label: "SDC",        measurementKey: VCU.sdcClosed,    boolLabels: ["Closed", "Open"] },
      { label: "Brakes",     measurementKey: VCU.activeBrakes, boolLabels: ["Braked", "Unbraked"] },
    ],
  },
  {
    board: BOARDS.HVBMS,
    name: "HVBMS",
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
    stateMeasurementKey: PCU_BOARD.state,
    stats: [
      { label: "Peak I",  measurementKey: PCU_BOARD.peakCurrent, unit: "A" },
      { label: "Freq",    measurementKey: PCU_BOARD.frequency,   unit: "Hz" },
    ],
  },
  {
    board: BOARDS.LCU,
    name: "LCU",
    stateMeasurementKey: LCU.masterState,
    stats: [
      { label: "Slave SM", measurementKey: LCU.slaveState },
    ],
  },
];

const StatItem = ({ board, stat }: { board: string; stat: Stat }) => {
  const raw = useMeasurement(board, stat.measurementKey);
  const display =
    typeof raw === "number"
      ? raw.toFixed(stat.decimals ?? 1)
      : typeof raw === "boolean" && stat.boolLabels
        ? stat.boolLabels[raw ? 0 : 1]
        : raw !== undefined
          ? String(raw)
          : "—";

  return (
    <div className="flex items-baseline gap-1 text-xs whitespace-nowrap">
      <span className="text-muted-foreground">{stat.label}:</span>
      <span className="text-foreground text-sm font-semibold tabular-nums">
        {display}
        {raw !== undefined && stat.unit && (
          <span className="text-muted-foreground ml-0.5 text-xs">{stat.unit}</span>
        )}
      </span>
    </div>
  );
};

const BoardRowItem = ({ row }: { row: BoardRow }) => {
  const state = useMeasurement(row.board, row.stateMeasurementKey);

  return (
    <div className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
      <span className="text-muted-foreground w-14 shrink-0 text-sm font-semibold uppercase tracking-wider">
        {row.name}
      </span>

      {/* Fixed-width slot so a longer/shorter state string doesn't shift the stats after it. */}
      <div className="w-48 shrink-0">
        <span className={`w-fit inline-block whitespace-nowrap rounded border px-2 py-0.5 text-sm font-bold ${stateBadgeClass(state)}`}>
          {state !== undefined ? String(state) : "—"}
        </span>
      </div>

      <div className="flex flex-1 flex-wrap justify-end gap-x-4 gap-y-1">
        {row.stats.map((stat) => (
          <StatItem key={stat.measurementKey} board={row.board} stat={stat} />
        ))}
      </div>
    </div>
  );
};

/** Single consolidated card showing every board's state and key measurements. */
const BoardsOverviewCard = () => (
  <Card className="gap-2 py-3">
    <CardHeader className="px-3 pb-0">
      <CardTitle className="text-sm font-semibold">Board States</CardTitle>
    </CardHeader>
    <CardContent className="divide-y px-3">
      {ROWS.map((row) => (
        <BoardRowItem key={row.board} row={row} />
      ))}
    </CardContent>
  </Card>
);

export default BoardsOverviewCard;
