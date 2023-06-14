import styles from "./ChartList.module.scss";
import { ChartWithLegend } from "./ChartWithLegend/ChartWithLegend";
import { DragEvent, useCallback } from "react";
import { useCharts } from "../useCharts";
import { nanoid } from "nanoid";
import { ChartLine } from "../ChartElement";

type Props = {
    getLine: (id: string) => ChartLine;
};

export const ChartList = ({ getLine }: Props) => {
    const { charts, addChart, removeChart, addLine, removeLine } = useCharts();

    const handleDrop = useCallback((ev: DragEvent<HTMLDivElement>) => {
        const id = ev.dataTransfer.getData("id");
        const line = getLine(id);
        addChart(nanoid(), line);
    }, []);

    const handleDropOnChart = useCallback((chartId: string, id: string) => {
        const line = getLine(id);
        addLine(chartId, line);
    }, []);

    return (
        <div
            className={styles.chartListWrapper}
            onDrop={handleDrop}
            onDragEnter={(ev) => {
                ev.preventDefault();
            }}
            onDragOver={(ev) => {
                ev.preventDefault();
            }}
        >
            {charts.map((chart) => {
                return (
                    <ChartWithLegend
                        key={chart.id}
                        chartElement={chart}
                        handleDropOnChart={handleDropOnChart}
                        removeElement={() => {
                            removeChart(chart.id);
                        }}
                        removeMeasurement={(measurementId: string) => {
                            removeLine(chart.id, measurementId);
                        }}
                    />
                );
            })}
        </div>
    );
};
