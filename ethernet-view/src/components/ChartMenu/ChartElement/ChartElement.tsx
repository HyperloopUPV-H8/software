// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';
import styles from "./ChartElement.module.scss";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { memo, useRef, useEffect, useCallback } from "react";
import { IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import { MeasurementId, NumericMeasurementInfo, UpdateFunction, useGlobalTicker } from 'common';
import { ChartId, useChartStore } from '../ChartStore';

type MeasurementToSerieAndUpdater = Map<MeasurementId, { DataSerie: ISeriesApi<"Line">, Updater: UpdateFunction }>;

type Props = {
    chartId: ChartId;
    chartHeight: number;
};

// React component that keeps the chart render and measurements represented on it.
export const ChartElement = memo(({ chartId, chartHeight }: Props) => {

    // Ref to the CanvasJS chart render
    const chartContainerRef = useRef<HTMLDivElement>(null);
    // Chart generated into chartContainer
    let chart : IChartApi;
    let chartLegend = useRef<HTMLDivElement>(null);
    // Ref to chart's data series
    const chartDataSeries = useRef<MeasurementToSerieAndUpdater>(new Map());
    const removeChart = useChartStore((state) => state.removeChart);

    // INITIALIZE ALL THE CHART INITIAL SETTINGS.
    useEffect(() => {
        // const measurement = getNumericMeasurementInfo(measurementId);
        // const chartLegendItem = createChartLegendItem(measurement);
        // chartLegendItem.onclick = (ev) => removeSeriesFromChart(ev, measurementId);
        // if (chartLegend) chartLegend.current?.appendChild(chartLegendItem);

        // const handleResize = () => {
        //     if (chartContainerRef.current)
        //     chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        // };

        // const resizeObserver = new ResizeObserver(handleResize);
        // if (chartContainerRef.current)
        // resizeObserver.observe(chartContainerRef.current);

        // if (!chartContainerRef.current) return;
        // chart = createChart(chartContainerRef.current, {
        //     layout: {
        //         background: { type: ColorType.Solid, color: "white" },
        //         textColor: "black",
        //     },
        //     width: chartContainerRef.current.clientWidth,
        //     height: chartHeight,
        //     timeScale: {
        //         timeVisible: true,
        //         secondsVisible: true,
        //         fixLeftEdge: true,
        //         fixRightEdge: true,
        //         lockVisibleTimeRangeOnResize: true,
        //     }
        // });

        // chartDataSeries.current.set(measurementId, {DataSerie: chart.addLineSeries({ color: measurement.color }), Updater: measurement.getUpdate});

        // return () => {
        //     resizeObserver.disconnect();
        //     chart.remove();
        // };
    });

    useEffect(() => {
        // if(chartContainerRef.current)
        // chartContainerRef.current.ondrop = (ev) => {
        //     ev.stopPropagation();
        //     const measurementId = ev.dataTransfer?.getData("id");
        //     if (measurementId === undefined || chartDataSeries.current.get(measurementId)) return;
        //     const measurement = getMeasurementInfo(measurementId);
        //     chartDataSeries.current.set(measurementId, {DataSerie: chart.addLineSeries({ color: measurement.color }), Updater: measurement.getUpdate});
        //     const chartLegendItem = createChartLegendItem(measurement);
        //     chartLegendItem.onclick = (ev) => removeSeriesFromChart(ev, measurementId);
        //     if (chartLegend) chartLegend.current?.appendChild(chartLegendItem);
        // };
    });

    // Update the chart with the new measurements values.
    useGlobalTicker(() => {
        chartDataSeries.current.forEach((serie) => {
            const {DataSerie, Updater} = serie;
            const update = Updater();
            const now = (Date.now() / 1000) as UTCTimestamp;
            DataSerie.update({ time: now, value: update });
        });
    });

    const removeSeriesFromChart = useCallback((ev: MouseEvent, measurementId: MeasurementId) => {
        ev.stopPropagation();
        chartDataSeries.current.delete(measurementId);
        if(chartDataSeries.current.size === 0) removeChart(chartId);
        const target = ev.target as HTMLDivElement;
        const parent = target.parentElement as HTMLDivElement;
        parent.remove();
    }, []);

    return (
        <div
            className={styles.chartWrapper}
            onDragEnter={(ev) => ev.preventDefault()}
            onDragOver={(ev) => ev.preventDefault()}
        >

            <div className={styles.chart}>
                <AiOutlineCloseCircle 
                    size={30}
                    cursor="pointer"
                    onClick={() => removeChart(chartId)}
                />
                <div ref={chartContainerRef}></div>
                <div className={styles.chartLegend} ref={chartLegend}></div>
            </div>
        </div>
    );
});

function createChartLegendItem(measurement: NumericMeasurementInfo) {
    const legendItem = document.createElement("div");
    legendItem.setAttribute("data-id", measurement.id);
    legendItem.className = styles.chartLegendItem;
    const seriesColor = document.createElement("div");
    seriesColor.className = styles.chartLegendItemColor;
    seriesColor.style.backgroundColor = measurement.color;
    const seriesName = document.createElement("p");
    seriesName.innerText = measurement.name;
    legendItem.appendChild(seriesColor);
    legendItem.appendChild(seriesName);
    return legendItem;
}
