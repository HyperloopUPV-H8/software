import styles from "./ChartList.module.scss";
import { DragEvent, useCallback, useState } from "react";
import { ChartElement } from "./ChartElement/ChartElement";
import { nanoid } from "nanoid";
export type ChartId = string;
export type MeasurementId = string;

export type MeasurementName = string;
export type MeasurementColor = string;
export type MeasurementUnits = string;
export type ChartInfo = {
  chartId: ChartId;
  measurementId: MeasurementId;
};

export type MeasurementInfo = {
  readonly id: MeasurementId;
  readonly name: MeasurementName;
  readonly range: [number | null, number | null];
  readonly color: MeasurementColor;
  readonly units: MeasurementUnits;
  readonly getUpdate: () => number;
};

type Props = {
  getMeasurementInfo: (id: MeasurementId) => MeasurementInfo;
};

export const ChartList = ({ getMeasurementInfo }: Props) => {
  const [charts, setCharts] = useState<ChartInfo[]>([]);

  const addChart = (chartId: ChartId, measurementId: MeasurementId) => {
    setCharts((prev) => [
      ...prev,
      {
        chartId: chartId,
        measurementId: measurementId,
      },
    ]);
  };

  const removeChart = useCallback((id: ChartId) => {
    setCharts((prev) => prev.filter((chart) => chart.chartId !== id));
  }, []);

  const handleDrop = (ev: DragEvent<HTMLDivElement>) => {
    const id = ev.dataTransfer.getData("id");
    const measurementId = getMeasurementInfo(id).id;
    addChart(nanoid(), measurementId);
  };

  return (
    <div
      className={styles.chartListWrapper}
      onDrop={handleDrop}
      onDragEnter={(ev) => ev.preventDefault()}
      onDragOver={(ev) => ev.preventDefault()}
    >
      {charts.map((chart) => (
        <ChartElement 
          chartId={chart.chartId}
          measurementId={chart.measurementId}
          chartHeight={300}
          getMeasurementInfo={getMeasurementInfo}
          removeChart={removeChart}
        />
      ))}
    </div>
  );
};
