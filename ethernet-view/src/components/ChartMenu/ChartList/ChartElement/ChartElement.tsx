import { ChartInfo, MeasurementInfo } from "components/ChartMenu/types";
import styles from "./ChartElement.module.scss";
import { Chart } from "./Chart";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useCallback } from "react";

type Props = {
    chart: ChartInfo;
    removeElement: (id: string) => void;
    getMeasurementInfo: (id: string) => MeasurementInfo;
    addMeasurementToChart: (chartId: string, measurementInfo: MeasurementInfo) => void;
    removeMeasurementFromChart: (chartId: string, measurementName: string) => void;
};

export const ChartElement = ({ chart, removeElement, getMeasurementInfo, addMeasurementToChart, removeMeasurementFromChart }: Props) => {

    const handleDropOnChart = useCallback((ev: any) => {
        ev.stopPropagation();
        const measurementId = ev.dataTransfer.getData("id");
        const measurement = getMeasurementInfo(measurementId);
        addMeasurementToChart(chart.chartId, measurement);
    }, [])

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
                    onClick={() => removeElement(chart.chartId)}
                />
                <Chart
                    chartId={chart.chartId}
                    measurements={chart.measurements}
                    removeMeasurementFromChart={(chartId, measurementId) => removeMeasurementFromChart(chartId, measurementId)}
                />
            </div>
        </div>
    );
};
