import { BOARDS, HVBMS, VCU } from "../../constants/measurements";
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

/* ─── Booster page ───────────────────────────────────────────────────────── */

const Booster = () => (
  <div className="flex h-full flex-col gap-6 overflow-auto p-4">

    {/* ── VCU Subsystem States ──────────────────────────────────────────── */}
    <section className="flex flex-col gap-3">
      <h2 className="text-foreground text-base font-semibold">VCU — Subsystem States</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <EnumRow label="HVBMS State"       board={BOARDS.VCU} measurementKey={VCU.hvbmsState}         goodValues={["Closed"]}    />
        <EnumRow label="PCU State"         board={BOARDS.VCU} measurementKey={VCU.pcuState}           goodValues={["Propulsion"]}/>
        <EnumRow label="LCU Vertical"      board={BOARDS.VCU} measurementKey={VCU.lcuVerticalState}   goodValues={["Levitation"]}/>
        <EnumRow label="LCU Horizontal"    board={BOARDS.VCU} measurementKey={VCU.lcuHorizontalState} goodValues={["Enabled"]}   />
      </div>
    </section>

    {/* ── Safety ───────────────────────────────────────────────────────── */}
    <section className="flex flex-col gap-3">
      <h2 className="text-foreground text-base font-semibold">Safety</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <EnumRow  label="SDC Status"        board={BOARDS.HVBMS} measurementKey={HVBMS.sdcStatus}     goodValues={["ENGAGED"]}   />
        <StatusRow label="SDC Closed (VCU)" board={BOARDS.VCU}   measurementKey={VCU.sdcClosed}       trueLabel="CLOSED" falseLabel="OPEN" />
        <StatusRow label="Contactors"       board={BOARDS.VCU}   measurementKey={VCU.contactorsClosed} trueLabel="CLOSED" falseLabel="OPEN" />
        <StatusRow label="Active Brakes"    board={BOARDS.VCU}   measurementKey={VCU.activeBrakes}    trueLabel="ENGAGED" falseLabel="DISENGAGED" trueIsGood={false} />
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
