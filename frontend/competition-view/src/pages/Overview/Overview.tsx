import { Button } from "@workspace/ui/components";
import { ChevronUp } from "@workspace/ui/icons";
import { useEffect, useRef, useState } from "react";
import {
  BOARDS,
  HVBMS,
  LCU,
  PCU,
  VCU,
} from "../../constants/measurements";
import useMeasurement from "../../hooks/useMeasurement";
import { useStore } from "../../store/store";
import type { MessageKind } from "../../types/message";
import MultiSeriesChart, { type SeriesConfig } from "../Charts/components/MultiSeriesChart";
import TelemetryChart from "../Charts/components/TelemetryChart";
import MessageItem from "../Messages/components/MessageItem";
import BoardsOverviewCard from "./components/BoardsOverviewCard";
import OrdersPanel from "./components/OrdersPanel";
import TrackProgress from "./components/TrackProgress";

/* ─── Stable series configs ─────────────────────────────────────────────── */

const DLIM_SERIES: SeriesConfig[] = [
  { board: BOARDS.PCU, measurementKey: PCU.motorCurrentU, label: "U", colorIndex: 0 },
  { board: BOARDS.PCU, measurementKey: PCU.motorCurrentV, label: "V", colorIndex: 1 },
  { board: BOARDS.PCU, measurementKey: PCU.motorCurrentW, label: "W", colorIndex: 2 },
];

const VERT_AIRGAP_SERIES: SeriesConfig[] = [
  { board: BOARDS.LCU, measurementKey: LCU.verticalAirgap1, label: "1", colorIndex: 0 },
  { board: BOARDS.LCU, measurementKey: LCU.verticalAirgap2, label: "2", colorIndex: 1 },
  { board: BOARDS.LCU, measurementKey: LCU.verticalAirgap3, label: "3", colorIndex: 2 },
  { board: BOARDS.LCU, measurementKey: LCU.verticalAirgap4, label: "4", colorIndex: 3 },
];

const LAT_AIRGAP_SERIES: SeriesConfig[] = [
  { board: BOARDS.LCU, measurementKey: LCU.horizontalAirgap1, label: "1", colorIndex: 0 },
  { board: BOARDS.LCU, measurementKey: LCU.horizontalAirgap2, label: "2", colorIndex: 1 },
  { board: BOARDS.LCU, measurementKey: LCU.horizontalAirgap3, label: "3", colorIndex: 2 },
  { board: BOARDS.LCU, measurementKey: LCU.horizontalAirgap4, label: "4", colorIndex: 3 },
];

const HEMS_SERIES: SeriesConfig[] = [
  { board: BOARDS.LCU, measurementKey: LCU.coilCurrentHEMS1, label: "H1", colorIndex: 0 },
  { board: BOARDS.LCU, measurementKey: LCU.coilCurrentHEMS2, label: "H2", colorIndex: 1 },
  { board: BOARDS.LCU, measurementKey: LCU.coilCurrentHEMS3, label: "H3", colorIndex: 2 },
  { board: BOARDS.LCU, measurementKey: LCU.coilCurrentHEMS4, label: "H4", colorIndex: 3 },
];

const EMS_SERIES: SeriesConfig[] = [
  { board: BOARDS.LCU, measurementKey: LCU.coilCurrentEMS1, label: "E1", colorIndex: 0 },
  { board: BOARDS.LCU, measurementKey: LCU.coilCurrentEMS2, label: "E2", colorIndex: 1 },
  { board: BOARDS.LCU, measurementKey: LCU.coilCurrentEMS3, label: "E3", colorIndex: 2 },
  { board: BOARDS.LCU, measurementKey: LCU.coilCurrentEMS4, label: "E4", colorIndex: 3 },
  { board: BOARDS.LCU, measurementKey: LCU.coilCurrentEMS5, label: "E5", colorIndex: 4 },
  { board: BOARDS.LCU, measurementKey: LCU.coilCurrentEMS6, label: "E6", colorIndex: 5 },
];

/* ─── Helpers ───────────────────────────────────────────────────────────── */

const fmtNum = (v: number | boolean | string | undefined, decimals = 1) =>
  typeof v === "number" ? v.toFixed(decimals) : undefined;

/* ─── Battery card ──────────────────────────────────────────────────────── */

interface BatteryRow {
  label: string;
  value: string | undefined;
  unit?: string;
  warn?: boolean;
}

interface BatteryCardProps {
  title: string;
  soc: number | undefined;
  rows: BatteryRow[];
}

/** SOC-level colouring: red below 20 %, amber below 40 %, green otherwise. */
const socColors = (soc: number | undefined) =>
  typeof soc !== "number" ? { bar: "bg-muted-foreground/20", text: "" }
  : soc < 20              ? { bar: "bg-red-500",   text: "text-red-500" }
  : soc < 40              ? { bar: "bg-amber-500", text: "text-amber-500" }
  :                         { bar: "bg-green-500", text: "" };

const BatteryCard = ({ title, soc, rows }: BatteryCardProps) => {
  const socPct = typeof soc === "number" ? Math.min(100, Math.max(0, soc)) : 0;
  const { bar, text } = socColors(soc);

  return (
    <div className="bg-card flex flex-col rounded-xl border p-2.5 gap-1.5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{title}</span>
        <span className={`text-base font-bold tabular-nums ${text}`}>
          {typeof soc === "number" ? soc.toFixed(0) : "—"}
          <span className="text-muted-foreground ml-0.5 text-xs font-normal">%</span>
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full transition-[width] ${bar}`} style={{ width: `${socPct}%` }} />
      </div>

      <div className="flex flex-col gap-0.5">
        {rows.map(({ label, value, unit, warn }) => (
          <div key={label} className="flex items-baseline justify-between">
            <span className="text-muted-foreground text-xs uppercase tracking-wider">{label}</span>
            <span className={`text-sm font-medium tabular-nums ${warn ? "text-red-500" : "text-foreground"}`}>
              {value ?? "—"}
              {value !== undefined && unit && (
                <span className="text-muted-foreground ml-0.5 text-xs font-normal">{unit}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Kinematics card ───────────────────────────────────────────────────── */

const KinematicsCard = () => {
  const speed    = useMeasurement(BOARDS.PCU, PCU.speed);
  const position = useMeasurement(BOARDS.PCU, PCU.position);
  const highPsi  = useMeasurement(BOARDS.VCU, VCU.highPressure);
  const lowPsi   = useMeasurement(BOARDS.VCU, VCU.lowPressure);

  const rows = [
    { label: "Position",     value: fmtNum(position),        unit: "m"    },
    { label: "High pres.",   value: fmtNum(highPsi),         unit: "bar"  },
    { label: "Low pres.",    value: fmtNum(lowPsi),          unit: "bar"  },
  ];

  return (
    <div className="bg-card flex flex-col rounded-xl border p-2.5 gap-1.5 shadow-sm">
      <span className="text-sm font-semibold">Kinematics</span>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold tabular-nums">{fmtNum(speed, 0) ?? "—"}</span>
        <span className="text-muted-foreground text-sm">km/h</span>
      </div>
      <div className="flex flex-col gap-0.5">
        {rows.map(({ label, value, unit }) => (
          <div key={label} className="flex items-baseline justify-between">
            <span className="text-muted-foreground text-xs uppercase tracking-wider">{label}</span>
            <span className="text-foreground text-sm font-medium tabular-nums">
              {value ?? "—"}
              {value !== undefined && unit && (
                <span className="text-muted-foreground ml-0.5 text-xs font-normal">{unit}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Safety card ───────────────────────────────────────────────────────── */

interface SafeRow { label: string; text: string; color: string }

const SafetyCard = () => {
  const sdcStatus     = useMeasurement(BOARDS.HVBMS, HVBMS.sdcStatus);
  const contactorHigh = useMeasurement(BOARDS.HVBMS, HVBMS.contactorHigh);
  const contactorLow  = useMeasurement(BOARDS.HVBMS, HVBMS.contactorLow);
  const contactors    = contactorHigh === undefined || contactorLow === undefined
    ? undefined
    : contactorHigh === true && contactorLow === true;
  const imd        = useMeasurement(BOARDS.HVBMS, HVBMS.imdOk);
  const hvBmsState = useMeasurement(BOARDS.HVBMS, HVBMS.operationalState);

  const rows: SafeRow[] = [
    {
      label: "SDC",
      text:  sdcStatus === undefined ? "—" : String(sdcStatus),
      color: sdcStatus === "ENGAGED" ? "text-green-500" : sdcStatus === "DISENGAGED" ? "text-red-500" : "text-muted-foreground",
    },
    {
      label: "Contactors",
      text:  contactors === true ? "CLOSED" : contactors === false ? "OPEN" : "—",
      color: contactors === true ? "text-green-500" : contactors === false ? "text-amber-500" : "text-muted-foreground",
    },
    {
      label: "IMD",
      text:  imd === true ? "OK" : imd === false ? "FAULT" : "—",
      color: imd === true ? "text-green-500" : imd === false ? "text-red-500" : "text-muted-foreground",
    },
    {
      label: "HV BMS",
      text:  hvBmsState === undefined ? "—" : String(hvBmsState),
      color: hvBmsState === "OPERATIONAL" ? "text-green-500" : "text-foreground",
    },
  ];

  return (
    <div className="bg-card flex flex-col rounded-xl border p-2.5 gap-1.5 shadow-sm">
      <span className="text-sm font-semibold">Safety</span>
      <div className="flex flex-col gap-1">
        {rows.map(({ label, text, color }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs uppercase tracking-wider">{label}</span>
            <span className={`text-sm font-semibold ${color}`}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Messages panel ────────────────────────────────────────────────────── */

const ALL_KINDS: MessageKind[] = ["info", "warning", "error", "debug"];
const KIND_LABEL: Record<MessageKind, string> = { info: "Info", warning: "Warn", error: "Err", debug: "Dbg" };

const MessagesPanel = () => {
  const messages      = useStore((s) => s.messages);
  const clearMessages = useStore((s) => s.clearMessages);

  const [activeKinds, setActiveKinds] = useState<Set<MessageKind>>(new Set(ALL_KINDS));
  const [scrolledAway, setScrolledAway] = useState(false);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const prevLenRef = useRef(0);

  const filtered = messages.filter((m) => activeKinds.has(m.kind));

  const toggleKind = (kind: MessageKind) =>
    setActiveKinds((prev) => {
      const next = new Set(prev);
      next.has(kind) ? next.delete(kind) : next.add(kind);
      return next;
    });

  useEffect(() => {
    if (filtered.length > prevLenRef.current && !scrolledAway) {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
    prevLenRef.current = filtered.length;
  }, [filtered.length, scrolledAway]);

  return (
    <div className="bg-card flex min-h-0 flex-1 flex-col rounded-xl border shadow-sm">
      <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b px-3 py-2">
        {ALL_KINDS.map((kind) => (
          <Button key={kind} size="sm" variant={activeKinds.has(kind) ? "default" : "outline"}
            onClick={() => toggleKind(kind)} className="h-6 rounded-full px-2 text-xs">
            {KIND_LABEL[kind]}
          </Button>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-muted-foreground text-xs">{filtered.length}/{messages.length}</span>
          <Button variant="outline" size="sm" className="h-6 px-2 text-xs"
            onClick={clearMessages} disabled={messages.length === 0}>
            Clear
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={(e) => setScrolledAway(e.currentTarget.scrollTop > 60)}
        className="relative min-h-0 flex-1 overflow-y-auto"
      >
        {filtered.length === 0 ? (
          <p className="text-muted-foreground flex h-full items-center justify-center text-sm">No messages</p>
        ) : (
          filtered.map((msg) => <MessageItem key={msg.id} message={msg} />)
        )}
        {scrolledAway && (
          <Button size="sm" variant="secondary"
            onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
            className="sticky bottom-3 left-1/2 z-10 -translate-x-1/2 gap-1 px-2 py-1 text-xs shadow">
            <ChevronUp className="size-3" /> Latest
          </Button>
        )}
      </div>
    </div>
  );
};

/* ─── HV battery card ───────────────────────────────────────────────────── */

/**
 * Leaf component so the HVBMS subscriptions re-render only this card —
 * keeping them in Dashboard would re-render the whole page tree on every
 * telemetry packet.
 */
const HvBatteryCard = () => {
  const hvSoc     = useMeasurement(BOARDS.HVBMS, HVBMS.soc);
  const hvVoltage = useMeasurement(BOARDS.HVBMS, HVBMS.batteriesVoltage);
  const hvCurrent = useMeasurement(BOARDS.HVBMS, HVBMS.currentReading);
  const hvVSensor = useMeasurement(BOARDS.HVBMS, HVBMS.voltageReading);

  return (
    <BatteryCard
      title="HV Battery"
      soc={typeof hvSoc === "number" ? hvSoc : undefined}
      rows={[
        { label: "Pack V",    value: fmtNum(hvVoltage), unit: "V" },
        { label: "Current",   value: fmtNum(hvCurrent), unit: "A" },
        { label: "DC Link",   value: fmtNum(hvVSensor), unit: "V" },
      ]}
    />
  );
};

/* ─── Dashboard ─────────────────────────────────────────────────────────── */

const Dashboard = () => {
  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden p-2">

      <TrackProgress />

      <div className="flex min-h-0 flex-1 gap-2">

        {/* ── Left column ────────────────────────────────────────────── */}
        <div className="flex min-h-0 flex-1 flex-col gap-2">

          {/* Summary cards row */}
          <div className="grid shrink-0 grid-cols-3 gap-2">
            <HvBatteryCard />
            <KinematicsCard />
            <SafetyCard />
          </div>

          {/* Charts — 2 cols × 3 rows */}
          <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-3 gap-2">
            <MultiSeriesChart title="DLIM — Phase Currents"  series={DLIM_SERIES}       unit="A"  />
            <TelemetryChart   title="Speed"                  board={BOARDS.PCU}          measurementKey={PCU.speed}    unit="km/h" colorIndex={0} />
            <MultiSeriesChart title="Vertical Airgaps"       series={VERT_AIRGAP_SERIES} unit="mm" />
            <MultiSeriesChart title="Lateral Airgaps"        series={LAT_AIRGAP_SERIES}  unit="mm" />
            <MultiSeriesChart title="HEMS — Coil Currents"   series={HEMS_SERIES}        unit="A"  />
            <MultiSeriesChart title="EMS — Coil Currents"    series={EMS_SERIES}         unit="A"  />
          </div>

        </div>

        {/* ── Right column ───────────────────────────────────────────── */}
        <div className="flex w-[35%] min-h-0 flex-col gap-2">

          <BoardsOverviewCard />

          <OrdersPanel />

          <MessagesPanel />

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
