import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components";
import { BOARDS, LCU } from "../../../constants/measurements";
import useMeasurement from "../../../hooks/useMeasurement";

/** Airgap warning threshold in mm. */
const AIRGAP_WARN_MM = 5;

const fmt = (v: number | boolean | string | undefined, decimals = 1) =>
  typeof v === "number" ? v.toFixed(decimals) : "—";

/* ─── Shared row component ─────────────────────────────────────────────── */

interface MeasurementRowProps {
  label: string;
  measurementKey: string;
  unit: string;
  decimals?: number;
  warnBelow?: number;
}

const MeasurementRow = ({
  label,
  measurementKey,
  unit,
  decimals = 1,
  warnBelow,
}: MeasurementRowProps) => {
  const value = useMeasurement(BOARDS.LCU, measurementKey);
  const isWarning =
    warnBelow !== undefined &&
    typeof value === "number" &&
    value < warnBelow;

  return (
    <div className="flex items-baseline justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium tabular-nums ${isWarning ? "text-amber-500" : "text-foreground"}`}>
        {fmt(value, decimals)}
        <span className="text-muted-foreground ml-0.5 font-normal">{unit}</span>
      </span>
    </div>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">
    {children}
  </p>
);

/* ─── Airgap sections ──────────────────────────────────────────────────── */

const VerticalAirgapsSection = () => (
  <div>
    <SectionLabel>Vertical Airgaps</SectionLabel>
    <div className="flex flex-col gap-1">
      <MeasurementRow label="V1" measurementKey={LCU.verticalAirgap1} unit="mm" warnBelow={AIRGAP_WARN_MM} />
      <MeasurementRow label="V2" measurementKey={LCU.verticalAirgap2} unit="mm" warnBelow={AIRGAP_WARN_MM} />
      <MeasurementRow label="V3" measurementKey={LCU.verticalAirgap3} unit="mm" warnBelow={AIRGAP_WARN_MM} />
      <MeasurementRow label="V4" measurementKey={LCU.verticalAirgap4} unit="mm" warnBelow={AIRGAP_WARN_MM} />
    </div>
  </div>
);

const HorizontalAirgapsSection = () => (
  <div>
    <SectionLabel>Lateral Airgaps</SectionLabel>
    <div className="flex flex-col gap-1">
      <MeasurementRow label="L1" measurementKey={LCU.horizontalAirgap1} unit="mm" warnBelow={AIRGAP_WARN_MM} />
      <MeasurementRow label="L2" measurementKey={LCU.horizontalAirgap2} unit="mm" warnBelow={AIRGAP_WARN_MM} />
      <MeasurementRow label="L3" measurementKey={LCU.horizontalAirgap3} unit="mm" warnBelow={AIRGAP_WARN_MM} />
      <MeasurementRow label="L4" measurementKey={LCU.horizontalAirgap4} unit="mm" warnBelow={AIRGAP_WARN_MM} />
    </div>
  </div>
);

const HemsCurrentsSection = () => (
  <div>
    <SectionLabel>HEMS Currents</SectionLabel>
    <div className="flex flex-col gap-1">
      <MeasurementRow label="H1" measurementKey={LCU.coilCurrentHEMS1} unit="A" decimals={2} />
      <MeasurementRow label="H2" measurementKey={LCU.coilCurrentHEMS2} unit="A" decimals={2} />
      <MeasurementRow label="H3" measurementKey={LCU.coilCurrentHEMS3} unit="A" decimals={2} />
      <MeasurementRow label="H4" measurementKey={LCU.coilCurrentHEMS4} unit="A" decimals={2} />
    </div>
  </div>
);

const EmsCurrentsSection = () => (
  <div>
    <SectionLabel>EMS Currents</SectionLabel>
    <div className="flex flex-col gap-1">
      <MeasurementRow label="E1" measurementKey={LCU.coilCurrentEMS1} unit="A" decimals={2} />
      <MeasurementRow label="E2" measurementKey={LCU.coilCurrentEMS2} unit="A" decimals={2} />
      <MeasurementRow label="E3" measurementKey={LCU.coilCurrentEMS3} unit="A" decimals={2} />
      <MeasurementRow label="E4" measurementKey={LCU.coilCurrentEMS4} unit="A" decimals={2} />
      <MeasurementRow label="E5" measurementKey={LCU.coilCurrentEMS5} unit="A" decimals={2} />
      <MeasurementRow label="E6" measurementKey={LCU.coilCurrentEMS6} unit="A" decimals={2} />
    </div>
  </div>
);

/* ─── Main card ─────────────────────────────────────────────────────────── */

const LcuAirgapCard = () => (
  <Card className="gap-3 py-4">
    <CardHeader className="px-4 pb-0">
      <CardTitle className="text-sm font-semibold">LCU — Levitation</CardTitle>
    </CardHeader>

    <CardContent className="px-4">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        <VerticalAirgapsSection />
        <HorizontalAirgapsSection />
        <HemsCurrentsSection />
        <EmsCurrentsSection />
      </div>
    </CardContent>
  </Card>
);

export default LcuAirgapCard;
