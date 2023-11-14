// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';
import { ChartId, MeasurementId, MeasurementInfo, Point } from "components/ChartMenu/types";
import styles from "./ChartElement.module.scss";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { MutableRefObject, memo, useCallback, useEffect, useRef, useState } from "react";
import { useInterval } from 'common';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

type Props = {
    chartId: ChartId;
    measurementId: MeasurementId;
    maxValue: number;
    removeChart: (id: ChartId) => void;
    getMeasurementInfo: (id: string) => MeasurementInfo;
};

// React component that keeps the chart render and measurements represented on it.
export const ChartElement = memo(({ chartId, measurementId, maxValue, removeChart, getMeasurementInfo }: Props) => {

    // Different measurements on this chart.
    // Each one is represented by a line.
    const [measurements, setMeasurements] = useState<MeasurementInfo[]>([]);

    let currentX = useRef(0);
    let chartRef = useRef<typeof CanvasJSChart>();

    // Event handler that adds a new line to the chart when the user
    // drops a measurementId on the chart.
    const handleDropOnChart = useCallback((ev: any) => {
        ev.stopPropagation();
        const measurementId = ev.dataTransfer.getData("id");
        const measurement = getMeasurementInfo(measurementId);
        setMeasurements((prev) => [...prev, measurement]);
    }, []);

    useEffect(() => {
        const measurement = getMeasurementInfo(measurementId);
        setMeasurements((prev) => [...prev, measurement]);
    }, [])

    // ChartData keeps all the dataSeries objects that are passed
    // to CanvasJSChart options
    const chartData = measurements.map((measurement) => {
        return {
            type: "line",
            showInLegend: true,
            name: measurement.name,
            color: measurement.color,
            dataPoints: [] as Point[],
        }
    });

    // Interval that gets the updated values for all the measurements every 5ms
    // in this chart and add them to it.
    useInterval(() => {
        for(let measurement of measurements) {
            const dataPoints = chartData.find((data) => data.name === measurement.name)?.dataPoints;
            if(dataPoints) {
                const point = {
                    x: currentX.current,
                    y: measurement.getUpdate(),
                };
                dataPoints.push(point);
                if(dataPoints.length > maxValue) {
                    dataPoints.shift();
                }
            }
        }
        chartRef.current?.render();
        currentX.current = currentX.current + 1;
    }, 5);

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
                <CanvasJSChart
                    options={{
                        height: 300,
                        data: chartData,
                        legend: {
                            fontSize: 16,
                            cursor: "pointer",
                            itemclick: (event: any) => {
                                event.chart.data[event.dataSeriesIndex].remove();
                                setMeasurements(prev => prev.filter(measurement =>
                                    (measurement.name !== event.dataSeries.name)
                                ));
                            }
                        },
                    }}
                onRef={(ref: MutableRefObject<undefined>) => {chartRef.current = ref;}}
            />
            </div>
        </div>
    );
});
