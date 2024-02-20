import styles from "./ChartLegend.module.scss";
import { useCallback, useEffect, useRef } from "react";
import { MeasurementId, NumericMeasurementInfo } from "common";
import { ChartId, useChartStore } from "components/ChartMenu/ChartStore";

interface Props {
    chartId: ChartId;
    measurements: NumericMeasurementInfo[];
}

export const ChartLegend = ({ chartId, measurements }: Props) => {
    const legendRef = useRef<HTMLDivElement>(null);
    const charts = useChartStore((state) => state.charts);
    const removeMeasurementFromChart = useChartStore((state) => state.removeMeasurementFromChart);
    const removeChart = useChartStore((state) => state.removeChart);

    const removeMeasurement = useCallback((measurementId: MeasurementId) => {
        removeMeasurementFromChart(chartId, measurementId);
        if (charts.find((chart) => chart.chartId === chartId)?.measurements.length === 0) {
            removeChart(chartId);
        }
    }, []);

    useEffect(() => {
        if (legendRef.current) {
            while (legendRef.current.firstChild) {
                legendRef.current.removeChild(legendRef.current.firstChild);
            }
            measurements.forEach((measurement) => {
                const newChartLegendItem = createChartLegendItem(measurement);
                newChartLegendItem.onclick = (_) => removeMeasurement(measurement.id);
                legendRef.current?.appendChild(newChartLegendItem);
            });
        }
    });

    return <div className={styles.chartLegend} ref={legendRef}></div>;
};

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
