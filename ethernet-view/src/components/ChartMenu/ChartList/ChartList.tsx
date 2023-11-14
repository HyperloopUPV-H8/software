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
    const { charts, addChart, removeChart } = useCharts();
    const memoRemoveChart = useCallback((id: string) => removeChart(id), []);

    const handleDrop = useCallback((ev: DragEvent<HTMLDivElement>) => {
        const id = ev.dataTransfer.getData("id");
        const measurementId = getMeasurementInfo(id).id;
        addChart(nanoid(), measurementId);
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
                    <>
                        <ChartElement
                            key={chart.chartId}
                            chartId={chart.chartId}
                            removeChart={memoRemoveChart}
                            measurementId={chart.measurementId}
                            getMeasurementInfo={getMeasurementInfo}
                        />
                    </>
                );
            })}
        </div>
    );
};
