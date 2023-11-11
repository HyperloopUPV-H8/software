import styles from "./ChartList.module.scss";
import { ChartElement } from "./ChartElement/ChartElement";
import { DragEvent, useCallback } from "react";
import { useCharts } from "../useCharts";
import { ChartInfo } from "../types";

type Props = {
    getChartInfo: (id: string) => ChartInfo;
};

export const ChartList = ({ getChartInfo }: Props) => {
    const { charts, addChart, removeChart } = useCharts();

    const handleDrop = useCallback((ev: DragEvent<HTMLDivElement>) => {
        const id = ev.dataTransfer.getData("id");
        const chartInfo = getChartInfo(id);
        addChart(chartInfo);
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
                        key={chart.id}
                        chartInfo={chart}
                        removeElement={() => {
                            removeChart(chart.id);
                        }}
                        removeMeasurement={() => {
                            removeChart(chart.id);
                        }}
                    />
                );
            })}
        </div>
    );
};
