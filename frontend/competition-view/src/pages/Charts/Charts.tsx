import { BOARDS, HVBMS, LCU, PCU, VCU } from "../../constants/measurements";
import MultiSeriesChart, { type SeriesConfig } from "./components/MultiSeriesChart";
import TelemetryChart from "./components/TelemetryChart";

/**
 * Real-time telemetry charts page.
 *
 * Row 1 — Kinematic:     Speed · Position
 * Row 2 — Electrical:    HV Battery SOC · HV Current
 * Row 3 — Motor phase:   DLIM (PCU U/V/W)
 * Row 4 — Levitation:    Vertical Airgaps · Lateral Airgaps
 * Row 5 — Lev. currents: HEMS coil currents · EMS coil currents
 */

const DLIM_SERIES: SeriesConfig[] = [
  { board: BOARDS.PCU, measurementKey: PCU.motorCurrentU, label: "U", colorIndex: 0 },
  { board: BOARDS.PCU, measurementKey: PCU.motorCurrentV, label: "V", colorIndex: 1 },
  { board: BOARDS.PCU, measurementKey: PCU.motorCurrentW, label: "W", colorIndex: 2 },
];

const VERT_AIRGAP_SERIES: SeriesConfig[] = [
  { board: BOARDS.LCU, measurementKey: LCU.verticalAirgap1, label: "V1", colorIndex: 0 },
  { board: BOARDS.LCU, measurementKey: LCU.verticalAirgap2, label: "V2", colorIndex: 1 },
  { board: BOARDS.LCU, measurementKey: LCU.verticalAirgap3, label: "V3", colorIndex: 2 },
  { board: BOARDS.LCU, measurementKey: LCU.verticalAirgap4, label: "V4", colorIndex: 3 },
];

const LAT_AIRGAP_SERIES: SeriesConfig[] = [
  { board: BOARDS.LCU, measurementKey: LCU.horizontalAirgap1, label: "L1", colorIndex: 0 },
  { board: BOARDS.LCU, measurementKey: LCU.horizontalAirgap2, label: "L2", colorIndex: 1 },
  { board: BOARDS.LCU, measurementKey: LCU.horizontalAirgap3, label: "L3", colorIndex: 2 },
  { board: BOARDS.LCU, measurementKey: LCU.horizontalAirgap4, label: "L4", colorIndex: 3 },
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

const Charts = () => (
  <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Row 1 — Kinematic */}
      <TelemetryChart title="Speed"    board={BOARDS.PCU}   measurementKey={PCU.speed}    unit="km/h" colorIndex={0} />
      <TelemetryChart title="Position" board={BOARDS.PCU}   measurementKey={PCU.position} unit="m"    colorIndex={1} />

      {/* Row 2 — Electrical */}
      <TelemetryChart title="HV Battery SOC" board={BOARDS.HVBMS} measurementKey={HVBMS.soc}            unit="%" colorIndex={2} />
      <TelemetryChart title="HV Current"     board={BOARDS.HVBMS} measurementKey={HVBMS.currentReading} unit="A" colorIndex={3} />

      {/* Row 3 — DLIM motor currents */}
      <MultiSeriesChart title="DLIM — Phase Currents" series={DLIM_SERIES} unit="A" />
      <TelemetryChart title="High Pressure" board={BOARDS.VCU} measurementKey={VCU.highPressure} unit="bar" colorIndex={4} />

      {/* Row 4 — Airgaps */}
      <MultiSeriesChart title="Vertical Airgaps" series={VERT_AIRGAP_SERIES} unit="mm" />
      <MultiSeriesChart title="Lateral Airgaps"  series={LAT_AIRGAP_SERIES}  unit="mm" />

      {/* Row 5 — Levitation currents */}
      <MultiSeriesChart title="HEMS — Coil Currents" series={HEMS_SERIES} unit="A" />
      <MultiSeriesChart title="EMS — Coil Currents"  series={EMS_SERIES}  unit="A" />
    </div>
  </div>
);

export default Charts;
