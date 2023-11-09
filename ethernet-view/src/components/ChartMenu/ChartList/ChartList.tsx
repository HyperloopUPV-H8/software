import styles from "./ChartList.module.scss";
import { ChartElement } from "./ChartWithLegend/ChartElement";
import { DragEvent, useCallback } from "react";
import { useCharts } from "../useCharts";
import { ChartLine } from "../ChartTypes";
import { Chart } from "canvasjs";

type Props = {
    getLine: (id: string) => ChartLine;
};

export const ChartList = ({ getLine }: Props) => {
    const { charts, addChart, removeChart, setCanvas } = useCharts();

    const handleDrop = useCallback((ev: DragEvent<HTMLDivElement>) => {
        const id = ev.dataTransfer.getData("id");
        const line = getLine(id);
        addChart(id, line);
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
                    <ChartElement
                        key={chart.id}
                        chartElement={chart}
                        removeElement={() => removeChart(chart.id) }
                        setCanvas={(canvas: Chart) => setCanvas(chart.id, canvas)}
                    />
                );
            })}
        </div>
    );
};
