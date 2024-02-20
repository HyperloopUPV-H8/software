import styles from './ChartLegend.module.scss';
import { useCallback } from 'react';
import { MeasurementId, NumericMeasurementInfo } from 'common';

interface Props {
  removeMeasurement: (measurementId: MeasurementId) => void;
}

export const ChartLegend = ({ removeMeasurement } : Props) => {

  // TODO: IMPLEMENT
  // const removeSeriesFromChart = useCallback((ev: MouseEvent, measurementId: MeasurementId) => {
  //   ev.stopPropagation();
  //   chartDataSeries.current.delete(measurementId);
  //   if(chartDataSeries.current.size === 0) removeChart(chartId);
  //   const target = ev.target as HTMLDivElement;
  //   const parent = target.parentElement as HTMLDivElement;
  //   parent.remove();
  // }, []);

  return (
    <div>ChartLegend</div>
  )
}

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