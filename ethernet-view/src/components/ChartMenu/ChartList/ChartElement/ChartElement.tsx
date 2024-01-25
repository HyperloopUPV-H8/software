// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';
import styles from "./ChartElement.module.scss";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { memo, useCallback, useRef, DragEvent, useEffect } from "react";
import { ChartId, MeasurementId, MeasurementInfo, } from '../ChartList';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';

export interface Point {
    x: number,
    y: number,
};

type Props = {
    chartId: ChartId;
    measurementId: MeasurementId;
    chartHeight: number;
    removeChart: (id: ChartId) => void;
    getMeasurementInfo: (id: MeasurementId) => MeasurementInfo;
};

// React component that keeps the chart render and measurements represented on it.
export const ChartElement = memo(({ chartId, measurementId, chartHeight, removeChart, getMeasurementInfo }: Props) => {

    // Ref to the CanvasJS chart render
    const chartContainerRef = useRef<HTMLDivElement>(null);
    // Ref to the data series of the CanvasJS chart render
    const chartMeasurements = useRef<MeasurementInfo[]>([]);

    // Scaffold the charts settings and add the first measurement passed by props to the chart when it is created.
    useEffect(() => {
        const measurement = getMeasurementInfo(measurementId);
        appendToChart(measurement, chartMeasurements.current);

        const handleResize = () => {
            if (chartContainerRef.current)
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            chart.timeScale().fitContent();
        };

        const resizeObserver = new ResizeObserver(handleResize);
        if (chartContainerRef.current)
        resizeObserver.observe(chartContainerRef.current);

        if (!chartContainerRef.current) return;
        let chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: "white" },
                textColor: "black",
            },
            width: chartContainerRef.current.clientWidth,
            height: chartHeight,
        });
        const dataSeries = chart.addLineSeries({ color: measurement.color });
        dataSeries.setData([
            { time: '2018-12-22', value: 32.51 },
            { time: '2018-12-23', value: 31.11 },
            { time: '2018-12-24', value: 27.02 },
            { time: '2018-12-25', value: 27.32 },
            { time: '2018-12-26', value: 25.17 },
            { time: '2018-12-27', value: 28.89 },
            { time: '2018-12-28', value: 25.46 },
            { time: '2018-12-29', value: 23.92 },
            { time: '2018-12-30', value: 22.68 },
            { time: '2018-12-31', value: 22.67 },
        ]);

        return () => {
            resizeObserver.disconnect();
            chart.remove();
        };
    }, []);

    // Event handler that adds a new line to the chart when the user
    // drops a measurementId on the chart.
    const handleDropOnChart = useCallback((ev: DragEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        const measurementId = ev.dataTransfer.getData("id");
        const measurement = getMeasurementInfo(measurementId);
        appendToChart(measurement, chartMeasurements.current);
    }, []);

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
                <div
                    ref={chartContainerRef}
                >
                </div>
                {/* <CanvasJSReact.CanvasJSChart
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
                /> */}
            </div>
        </div>
    );
});

// export function createDataSeries(measurement: MeasurementInfo): DataSeries {
//     return {
//         type: "line",
//         legendText: measurement.units ? `${measurement.name} (${measurement.units})` : measurement.name,
//         showInLegend: true,
//         name: measurement.name,
//         color: measurement.color,
//         dataPoints: [] as Point[],
//         updateFunction: measurement.getUpdate,
//     };
// }

function appendToChart(dataSeries: MeasurementInfo, chartMeasurements: MeasurementInfo[]) {
    const dataSeriesInChart = chartMeasurements.find((measurement: MeasurementInfo) => measurement.name === measurement.name);
        if(!dataSeriesInChart) {
            chartMeasurements.push(dataSeries);
    }
}