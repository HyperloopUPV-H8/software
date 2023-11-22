// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';
import styles from "./ChartElement.module.scss";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { MutableRefObject, memo, useCallback, useRef, DragEvent, useEffect } from "react";
import { useInterval } from 'common';
import { ChartId, MeasurementColor, MeasurementId, MeasurementInfo, MeasurementName } from '../ChartList';

export interface Point {
    x: number,
    y: number,
};

export type DataSeries = {
    type: string,
    legendText: string,
    showInLegend: boolean,
    name: MeasurementName,
    color: MeasurementColor,
    dataPoints: Point[],
    updateFunction: () => void,
};

type Props = {
    chartId: ChartId;
    measurementId: MeasurementId;
    maxValue: number;
    refreshRate: number;
    removeChart: (id: ChartId) => void;
    getMeasurementInfo: (id: MeasurementId) => MeasurementInfo;
};

// React component that keeps the chart render and measurements represented on it.
export const ChartElement = memo(({ chartId, measurementId, maxValue, removeChart, getMeasurementInfo, refreshRate }: Props) => {

    // Ref to the CanvasJS chart render
    let chartRef = useRef<typeof CanvasJSReact.CanvasJSChart>();
    let currentX = useRef(0);

    // Adds the first measurement passed by props to the chart when it is created.
    useEffect(() => {
        const measurement = getMeasurementInfo(measurementId);
        const dataSeries = createDataSeries(measurement);
        chartRef.current?.options.data.push(dataSeries);
    }, []);

    // Event handler that adds a new line to the chart when the user
    // drops a measurementId on the chart.
    const handleDropOnChart = useCallback((ev: DragEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        const measurementId = ev.dataTransfer.getData("id");
        const measurement = getMeasurementInfo(measurementId);
        const dataSeries = createDataSeries(measurement);
        chartRef.current?.options.data.push(dataSeries);
    }, []);

    // Interval that gets the updated values for all the measurements every 5ms
    // in this chart and add them to it.
    useInterval(() => {
        const chartDataSeries = chartRef.current?.options.data;
        for(let chartDs of chartDataSeries) {
            const newValue = chartDs.updateFunction();
            chartDs.dataPoints.push({ x: currentX.current, y: newValue });
            if (chartDs.dataPoints.length > maxValue) {
                chartDs.dataPoints.shift();
            }
        }
        chartRef.current?.render();
        currentX.current = currentX.current + 1;
    }, refreshRate);

    return (
        <div
            className={styles.chartWrapper}
            onDragEnter={(ev) => ev.preventDefault()}
            onDragOver={(ev) => ev.preventDefault()}
            onDrop={handleDropOnChart}
        >

            <div className={styles.chart}>
                <AiOutlineCloseCircle 
                    size={30}
                    cursor="pointer"
                    onClick={() => removeChart(chartId)}
                />
                <CanvasJSReact.CanvasJSChart
                    options={{
                        height: 300,
                        data: [] as DataSeries[],
                        axisX: {
                            labelFormatter: () => "",
                        },
                        legend: {
                            fontSize: 16,
                            cursor: "pointer",
                            itemclick: (event: any) => {
                                event.chart.data[event.dataSeriesIndex].remove();
                                if(event.chart.data.length === 0) removeChart(chartId)
                            }
                        },
                    }}
                    onRef={(ref: MutableRefObject<undefined>) => {chartRef.current = ref;}}
                />
            </div>
        </div>
    );
});

export function createDataSeries(measurement: MeasurementInfo): DataSeries {
    return {
        type: "line",
        legendText: measurement.units ? `${measurement.name} (${measurement.units})` : measurement.name,
        showInLegend: true,
        name: measurement.name,
        color: measurement.color,
        dataPoints: [] as Point[],
        updateFunction: measurement.getUpdate,
    };
}