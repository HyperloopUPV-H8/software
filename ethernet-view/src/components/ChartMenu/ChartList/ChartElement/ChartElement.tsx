// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';
import styles from "./ChartElement.module.scss";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { memo, useCallback, useRef, DragEvent, useEffect } from "react";
import { ChartId, MeasurementId, MeasurementInfo, UpdateFunction, } from '../ChartList';
import { createChart, ColorType, IChartApi, ISeriesApi, SeriesType, LineSeriesOptions, UTCTimestamp } from 'lightweight-charts';
import { useGlobalTicker } from 'common';

type DataSerieWithUpdater = [ISeriesApi<"Line">, UpdateFunction];

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
    // Chart generated into chartContainer
    let chart : IChartApi;
    // Ref to the measurements of the chart render
    const chartMeasurements = useRef<MeasurementInfo[]>([]);
    // Ref to chart's data series
    const chartDataSeries = useRef<DataSerieWithUpdater[]>([]);

    // Event handler that adds a new line to the chart when the user
    // drops a measurementId on the chart.
    const handleDropOnChart = useCallback((ev: DragEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        const measurementId = ev.dataTransfer.getData("id");
        const measurement = getMeasurementInfo(measurementId);
        appendToChart(measurement, chartMeasurements.current);
    }, []);

    // Initialize the charts settings and add the first measurement passed by props to the chart.
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
        chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: "white" },
                textColor: "black",
            },
            width: chartContainerRef.current.clientWidth,
            height: chartHeight,
            timeScale: {
                timeVisible: true,
                secondsVisible: true,
                fixLeftEdge: true,
                fixRightEdge: true,
                lockVisibleTimeRangeOnResize: true,
            }
        });
        chartDataSeries.current.push([chart.addLineSeries({ color: measurement.color }), measurement.getUpdate]);

        return () => {
            resizeObserver.disconnect();
            chart.remove();
        };
    }, []);

    // Update the chart with the new measurements values.
    useGlobalTicker(() => {
        chartDataSeries.current.forEach((serie) => {
            const [dataSerie, getUpdate] = serie;
            const update = getUpdate();
            const now = Date.now() as UTCTimestamp;
            dataSerie.update({ time: now, value: update });
        });
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
                <div
                    ref={chartContainerRef}
                >
                </div>
            </div>
        </div>
    );
});

function appendToChart(newMeasurement: MeasurementInfo, chartMeasurements: MeasurementInfo[]) {
    const measurementInChart = chartMeasurements.find((measurement: MeasurementInfo) => measurement.name === measurement.name);
    if(!measurementInChart)
        chartMeasurements.push(newMeasurement);
}