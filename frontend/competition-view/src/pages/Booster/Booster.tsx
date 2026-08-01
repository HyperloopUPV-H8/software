import { BOARDS, HVBMS, HVSCU_CABINET, VCU } from "../../constants/measurements";
import useMeasurement from "../../hooks/useMeasurement";

/* ─── Helpers ───────────────────────────────────────────────────────────── */

const boolColor = (v: number | boolean | string | undefined, trueIsGood: boolean) => {
  if (v === undefined) return "text-muted-foreground";
  const t = v === true  || String(v).toUpperCase() === "TRUE";
  const f = v === false || String(v).toUpperCase() === "FALSE";
  if (!t && !f) return "text-muted-foreground";
  return (t === trueIsGood) ? "text-green-500" : "text-red-500";
};

/* ─── Status row ─────────────────────────────────────────────────────────── */

interface StatusRowProps {
  label: string;
  board: string;
  measurementKey: string;
  trueLabel?: string;
  falseLabel?: string;
  trueIsGood?: boolean;
}

const StatusRow = ({ label, board, measurementKey, trueLabel = "YES", falseLabel = "NO", trueIsGood = true }: StatusRowProps) => {
  const v = useMeasurement(board, measurementKey);
  const isTrue  = v === true  || String(v).toUpperCase() === "TRUE";
  const isFalse = v === false || String(v).toUpperCase() === "FALSE";
  const text = v === undefined ? "—" : isTrue ? trueLabel : isFalse ? falseLabel : String(v);

  return (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold ${boolColor(v, trueIsGood)}`}>{text}</span>
    </div>
  );
};

/* ─── Enum row ───────────────────────────────────────────────────────────── */

const EnumRow = ({ label, board, measurementKey, goodValues = [] }: {
  label: string; board: string; measurementKey: string; goodValues?: string[]
}) => {
  const v = useMeasurement(board, measurementKey);
  const text = v === undefined ? "—" : String(v);
  const isGood = goodValues.some(g => text.toUpperCase() === g.toUpperCase());
  const color = v === undefined ? "text-muted-foreground" : isGood ? "text-green-500" : "text-foreground";

  return (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold ${color}`}>{text}</span>
    </div>
  );
};

/* ─── Value row ──────────────────────────────────────────────────────────── */

const ValueRow = ({ label, board, measurementKey, unit, digits = 1 }: {
  label: string; board: string; measurementKey: string; unit: string; digits?: number
}) => {
  const v = useMeasurement(board, measurementKey);
  const text = typeof v === "number" ? v.toFixed(digits) : "—";

  return (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-foreground text-sm font-semibold tabular-nums">
        {text} <span className="text-muted-foreground font-normal">{unit}</span>
      </span>
    </div>
  );
};

/* ─── Booster page ───────────────────────────────────────────────────────── */

const Booster = () => (
  <div className="flex h-full flex-col gap-6 overflow-auto p-4">

    {/* ── VCU Subsystem Connectivity ────────────────────────────────────── */}
    <section className="flex flex-col gap-3">
      <h2 className="text-foreground text-base font-semibold">VCU — Subsystem Connectivity</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <StatusRow label="HVBMS" board={BOARDS.VCU} measurementKey={VCU.hvbmsConnected} trueLabel="CONNECTED" falseLabel="DISCONNECTED" />
        <StatusRow label="PCU"   board={BOARDS.VCU} measurementKey={VCU.pcuConnected}   trueLabel="CONNECTED" falseLabel="DISCONNECTED" />
        <StatusRow label="LCU"   board={BOARDS.VCU} measurementKey={VCU.lcuConnected}   trueLabel="CONNECTED" falseLabel="DISCONNECTED" />
      </div>
    </section>

    {/* ── HVSCU Cabinet ────────────────────────────────────────────────── */}
    <section className="flex flex-col gap-3">
      <h2 className="text-foreground text-base font-semibold">HVSCU Cabinet</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <ValueRow label="DC Link Voltage" board={BOARDS.HVSCU_CABINET} measurementKey={HVSCU_CABINET.dcLinkVoltage} unit="V" />
      </div>
    </section>

    {/* ── Safety ───────────────────────────────────────────────────────── */}
    <section className="flex flex-col gap-3">
      <h2 className="text-foreground text-base font-semibold">Safety</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <EnumRow  label="SDC Status"        board={BOARDS.HVBMS} measurementKey={HVBMS.sdcStatus}     goodValues={["ENGAGED"]}   />
        <StatusRow label="SDC Closed (VCU)" board={BOARDS.VCU}   measurementKey={VCU.sdcClosed}       trueLabel="CLOSED" falseLabel="OPEN" />
        <EnumRow  label="Brakes Status"     board={BOARDS.VCU}   measurementKey={VCU.brakesStatus}    goodValues={["UNBRAKED"]} />
        <StatusRow label="Brake Fault"      board={BOARDS.VCU}   measurementKey={VCU.brakeFault}      trueLabel="FAULT"  falseLabel="OK"          trueIsGood={false} />
        <EnumRow  label="IMD Status"        board={BOARDS.HVBMS} measurementKey={HVBMS.imdStatus}     goodValues={["NORMAL"]}    />
        <StatusRow label="IMD OK"           board={BOARDS.HVBMS} measurementKey={HVBMS.imdOk}         trueLabel="OK"     falseLabel="FAULT"        />
      </div>
    </section>

    {/* ── HVBMS Contactors ─────────────────────────────────────────────── */}
    <section className="flex flex-col gap-3">
      <h2 className="text-foreground text-base font-semibold">HVBMS — Contactors</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <StatusRow label="Precharge"    board={BOARDS.HVBMS} measurementKey={HVBMS.contactorPrecharge}  trueLabel="CLOSED" falseLabel="OPEN" />
        <StatusRow label="Discharge"    board={BOARDS.HVBMS} measurementKey={HVBMS.contactorDischarge}  trueLabel="CLOSED" falseLabel="OPEN" />
        <StatusRow label="High"         board={BOARDS.HVBMS} measurementKey={HVBMS.contactorHigh}       trueLabel="CLOSED" falseLabel="OPEN" />
        <StatusRow label="Low"          board={BOARDS.HVBMS} measurementKey={HVBMS.contactorLow}        trueLabel="CLOSED" falseLabel="OPEN" />
        <StatusRow label="Common High"  board={BOARDS.HVBMS} measurementKey={HVBMS.contactorCommonHigh} trueLabel="CLOSED" falseLabel="OPEN" />
      </div>
    </section>

  </div>
);

export default Booster;
