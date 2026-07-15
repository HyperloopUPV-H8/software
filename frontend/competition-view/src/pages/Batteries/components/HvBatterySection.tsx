import { formatAxisValue } from "../../../constants/chartConfig";
import {
  BOARDS,
  CELL_V_RANGE,
  CELL_V_WARN_HIGH,
  CELL_V_WARN_LOW,
  HVBMS,
  PACK_V_RANGE,
} from "../../../constants/measurements";
import { useStaleFlags } from "../../../hooks/useIsStale";
import useMeasurement from "../../../hooks/useMeasurement";
import { STALE_TEXT_CLASS } from "../../../lib/freshness";
import BatteryPackCard from "./BatteryPackCard";

/** Measurement ids backing the summary tiles, in display order (stable for useStaleFlags). */
const SUMMARY_STALE_IDS = [
  HVBMS.batteriesVoltage,
  HVBMS.soc,
  HVBMS.voltageMax,
  HVBMS.voltageMin,
  HVBMS.tempMax,
  HVBMS.tempMin,
] as const;

const PACK_COUNT = 8;
const PACK_NUMBERS = Array.from({ length: PACK_COUNT }, (_, i) => i + 1);

// Sane magnitudes get fixed decimals; garbage/misdecoded samples fall back
// to compact/exponential notation so they never blow out the tile width.
const fmt = (v: number | boolean | string | undefined, decimals = 1) =>
  typeof v !== "number" ? "—"
  : Math.abs(v) < 1e4   ? v.toFixed(decimals)
  :                       formatAxisValue(v);

const HvBatterySection = () => {
  const totalVoltage  = useMeasurement(BOARDS.HVBMS, HVBMS.batteriesVoltage);
  const voltageMax    = useMeasurement(BOARDS.HVBMS, HVBMS.voltageMax);
  const voltageMin    = useMeasurement(BOARDS.HVBMS, HVBMS.voltageMin);
  const tempMax       = useMeasurement(BOARDS.HVBMS, HVBMS.tempMax);
  const tempMin       = useMeasurement(BOARDS.HVBMS, HVBMS.tempMin);
  const soc           = useMeasurement(BOARDS.HVBMS, HVBMS.soc);
  const contactorHigh = useMeasurement(BOARDS.HVBMS, HVBMS.contactorHigh);
  const contactorLow  = useMeasurement(BOARDS.HVBMS, HVBMS.contactorLow);
  const contactors    = contactorHigh === undefined || contactorLow === undefined
    ? undefined
    : contactorHigh === true && contactorLow === true;

  const staleFlags = useStaleFlags(BOARDS.HVBMS, SUMMARY_STALE_IDS);

  return (
    <section className="flex h-full min-h-0 flex-col gap-2">
      {/* Section header */}
      <div className="flex shrink-0 items-center gap-3">
        <h2 className="text-foreground text-base font-semibold">High Voltage</h2>
        <span className="text-muted-foreground text-xs">8 groups · 12 cells each</span>
        {contactors !== undefined && (
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
              contactors === true
                ? "border-green-500 text-green-600 dark:text-green-400"
                : "border-red-500 text-red-600 dark:text-red-400"
            }`}
          >
            Contactors {contactors === true ? "Closed" : "Open"}
          </span>
        )}
      </div>

      {/* Summary stats — SOC / cell extremes reuse the cell warning thresholds */}
      <div className="bg-card grid shrink-0 grid-cols-6 gap-px overflow-hidden rounded-xl border shadow-sm">
        {[
          {
            label: "Total V", value: fmt(totalVoltage), unit: "V",
            range: PACK_V_RANGE,
          },
          {
            label: "SOC", value: fmt(soc, 0), unit: "%",
            valueClass: typeof soc !== "number" ? "" : soc < 20 ? "text-red-500" : soc < 40 ? "text-amber-500" : "",
          },
          {
            label: "V max", value: fmt(voltageMax, 3), unit: "V",
            range: CELL_V_RANGE,
            valueClass: typeof voltageMax === "number" && voltageMax > CELL_V_WARN_HIGH ? "text-amber-500" : "",
          },
          {
            label: "V min", value: fmt(voltageMin, 3), unit: "V",
            range: CELL_V_RANGE,
            valueClass: typeof voltageMin === "number" && voltageMin < CELL_V_WARN_LOW ? "text-red-500" : "",
          },
          { label: "T max",    value: fmt(tempMax),       unit: "°C" },
          { label: "T min",    value: fmt(tempMin),       unit: "°C" },
        ].map(({ label, value, unit, valueClass, range }, i) => (
          <div key={label} className="bg-card flex min-w-0 flex-col items-center gap-0.5 px-2 py-2">
            <span className="text-muted-foreground text-xs">{label}</span>
            <span className={`block w-full truncate text-center text-xl font-bold tabular-nums ${staleFlags[i] ? STALE_TEXT_CLASS : valueClass || "text-foreground"}`}>
              {value}
              <span className="text-muted-foreground ml-1 text-sm font-normal">
                {unit}
              </span>
              {range && (
                <span className="text-muted-foreground ml-1 text-sm font-normal tabular-nums">
                  [{range[0]}–{range[1]}]
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Group strips — one row per group, stacked to fill the viewport without scrolling */}
      <div className="flex min-h-0 flex-1 flex-col gap-1.5">
        {PACK_NUMBERS.map((n) => (
          <BatteryPackCard key={n} packNumber={n} />
        ))}
      </div>
    </section>
  );
};

export default HvBatterySection;
