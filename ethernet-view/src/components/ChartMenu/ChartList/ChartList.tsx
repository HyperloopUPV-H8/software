import styles from "./ChartList.module.scss";
import { DragEvent, useCallback, useState } from "react";
import { ChartElement } from "../ChartElement/ChartElement";
import { nanoid } from "nanoid";
import { MeasurementId, NumericMeasurementInfo } from "common";
import { ChartId, useChartStore } from "../ChartStore";

type Props = {
    getMeasurementInfo: (id: MeasurementId) => NumericMeasurementInfo;
};

export const ChartList = ({ getMeasurementInfo }: Props) => {

    const charts = useChartStore((state) => state.charts);
    const createChart = useChartStore((state) => state.addChart);

    const handleDrop = (ev: DragEvent<HTMLDivElement>) => {
        const id = ev.dataTransfer.getData("id");
        const measurementId = getNumericMeasurementInfo(id).id;
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
                    key={chart.chartId}
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
