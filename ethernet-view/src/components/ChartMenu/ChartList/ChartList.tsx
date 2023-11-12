import styles from "./ChartList.module.scss";
import { ChartElement } from "./ChartElement/ChartElement";
import { DragEvent, useCallback } from "react";
import { useCharts } from "../useCharts";
import { MeasurementInfo } from "../types";
import { nanoid } from "nanoid";

type Props = {
    getMeasurementInfo: (id: string) => MeasurementInfo;
};

export const ChartList = ({ getMeasurementInfo }: Props) => {
    const { charts, addChart, removeChart, addMeasurementToChart, removeMeasurementFromChart } = useCharts();

    const handleDrop = useCallback((ev: DragEvent<HTMLDivElement>) => {
        const id = ev.dataTransfer.getData("id");
        const measurementInfo = getMeasurementInfo(id);
        addChart(nanoid(), measurementInfo);
    }, []);

    return (
        <div
            className={styles.chartListWrapper}
            onDrop={handleDrop}
            onDragEnter={(ev) => ev.preventDefault()}
            onDragOver={(ev) => ev.preventDefault()}
        >
            {charts.map((chart) => {
                return (
                    <ChartElement
                        key={chart.chartId}
                        chart={chart}
                        getMeasurementInfo={getMeasurementInfo}
                        removeElement={removeChart}
                        addMeasurementToChart={addMeasurementToChart}
                        removeMeasurementFromChart={removeMeasurementFromChart}
                    />
                );
            })}
        </div>
    );
};
