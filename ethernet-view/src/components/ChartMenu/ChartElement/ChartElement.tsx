import styles from "./ChartElement.module.scss";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useMeasurementsStore } from 'common';
import { ChartInfo, useChartStore } from '../ChartStore';
import { ChartCanvas } from './ChartCanvas/ChartCanvas';
import { ChartLegend } from './ChartLegend/ChartLegend';
import { useCallback } from "react";

type Props = {
    chart: ChartInfo;
};

// React component that keeps the chart render and measurements represented on it.
export const ChartElement = ({ chart }: Props) => {
    const removeChart = useChartStore((state) => state.removeChart);
    const addMeasurementToChart = useChartStore((state) => state.addMeasurementToChart);
    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);

    const handleDrop = useCallback((ev: React.DragEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        const id = ev.dataTransfer.getData("id");
        const measurementInfo = getNumericMeasurementInfo(id);
        addMeasurementToChart(chart.chartId, measurementInfo);
    }, []);

    return (
        <div
            className={styles.chartWrapper}
            onDrop={handleDrop}
            onDragEnter={(ev) => ev.preventDefault()}
            onDragOver={(ev) => ev.preventDefault()}
        >   
            <div className={styles.chart}>
                <AiOutlineCloseCircle
                    size={30}
                    cursor="pointer"
                    onClick={() => removeChart(chart.chartId)}
                />
                <ChartCanvas measurements={chart.measurements} />
                <ChartLegend chartId={chart.chartId} measurements={chart.measurements} />
            </div>
        </div>
    );
};
