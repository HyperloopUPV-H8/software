// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';
import styles from "./ChartElement.module.scss";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { MutableRefObject, memo, useCallback, useRef, DragEvent, useEffect } from "react";
import { useGlobalTicker } from 'common';
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
    updateFunction: () => number,
};

type Props = {
    chartId: ChartId;
    measurementId: MeasurementId;
    maxValue: number;
    removeChart: (id: ChartId) => void;
    getMeasurementInfo: (id: MeasurementId) => MeasurementInfo;
};

// React component that keeps the chart render and measurements represented on it.
export const ChartElement = memo(({ chartId, measurementId, maxValue, removeChart, getMeasurementInfo }: Props) => {

    // Ref to the CanvasJS chart render
    const chartRef = useRef<typeof CanvasJSReact.CanvasJSChart>();
    const currentX = useRef(0);
    const chartDataSeries = useRef<DataSeries[]>([]);

    // Adds the first measurement passed by props to the chart when it is created.
    useEffect(() => {
        const measurement = getMeasurementInfo(measurementId);
        const dataSeries = createDataSeries(measurement);
        chartDataSeries.current.push(dataSeries);
    }, []);

    // Event handler that adds a new line to the chart when the user
    // drops a measurementId on the chart.
    const handleDropOnChart = useCallback((ev: DragEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        const measurementId = ev.dataTransfer.getData("id");
        const measurement = getMeasurementInfo(measurementId);
        const dataSeries = createDataSeries(measurement);
        chartDataSeries.current.push(dataSeries);
    }, []);

    // Interval that gets the updated values for all the measurements at GlobalTicker refresh rate
    // in this chart and add them to it.
    useGlobalTicker(() => {
        for(let chartDs of chartDataSeries.current) {
            const newValue = chartDs.updateFunction();
            chartDs.dataPoints.push({ x: currentX.current, y: newValue } as Point);
            if (chartDs.dataPoints.length > maxValue) {
                chartDs.dataPoints.shift();
            }
        }
        chartRef.current?.render();
        currentX.current = currentX.current + 1;
    });

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
                        data: chartDataSeries.current,
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
