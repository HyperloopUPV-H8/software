import styles from "./ChartList.module.scss";
import { ChartElement } from "./ChartElement/ChartElement";
import { DragEvent, useCallback, useState } from "react";
import { MeasurementInfo, ChartInfo, ChartId, MeasurementId } from "../types";
import { nanoid } from "nanoid";

type Props = {
    getMeasurementInfo: (id: MeasurementId) => MeasurementInfo;
};

export const ChartList = ({ getMeasurementInfo }: Props) => {
    const [charts, setCharts] = useState<ChartInfo[]>([])

    const addChart = (chartId: ChartId, measurementId: MeasurementId) => {
        setCharts((prev) => [...prev, {
            chartId: chartId,
            measurementId: measurementId, 
        }]);
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
            {charts.map((chart) => {
                return (
                    <>
                        <ChartElement
                            key={chart.chartId}
                            chartId={chart.chartId}
                            maxValue={300}
                            refreshRate={5}
                            removeChart={removeChart}
                            measurementId={chart.measurementId}
                            getMeasurementInfo={getMeasurementInfo}
                        />
                    </>
                );
            })}
        </div>
    );
};
