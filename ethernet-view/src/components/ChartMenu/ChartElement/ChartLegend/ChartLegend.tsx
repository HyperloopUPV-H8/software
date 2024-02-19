import styles from './ChartLegend.module.scss';
import { MeasurementInfo } from '../../ChartList/ChartList';

export const ChartLegend = () => {
  return (
    <div>ChartLegend</div>
  )
}

function createChartLegendItem(measurement: MeasurementInfo) {
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