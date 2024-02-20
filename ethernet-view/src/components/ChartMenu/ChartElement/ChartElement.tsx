// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';
import styles from "./ChartElement.module.scss";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { memo } from "react";
import { MeasurementId, useMeasurementsStore } from 'common';
import { ChartId, useChartStore } from '../ChartStore';
import { ChartCanvas } from './ChartCanvas/ChartCanvas';
import { ChartLegend } from './ChartLegend/ChartLegend';

type Props = {
    chartId: ChartId;
};

// React component that keeps the chart render and measurements represented on it.
export const ChartElement = memo(({ chartId }: Props) => {

    const getMeasurementsFromChart = useChartStore((state) => state.getMeasurementsFromChart);
    const removeChart = useChartStore((state) => state.removeChart);
    const addMeasurementToChart = useChartStore((state) => state.addMeasurementToChart);
    const removeMeasurementFromChart = useChartStore((state) => state.removeMeasurementFromChart);
    const measurements = getMeasurementsFromChart(chartId);
    const charts = useChartStore((state) => state.charts);

    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);

    const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
        ev.stopPropagation();
        const id = ev.dataTransfer.getData("id");
        const measurementInfo = getNumericMeasurementInfo(id);
        addMeasurementToChart(chartId, measurementInfo);
    };

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
                    onClick={() => removeChart(chartId)}
                />
                {measurements ? 
                (
                <>
                    <ChartCanvas 
                        measurements={measurements} 
                    />
                    <ChartLegend
                        removeMeasurement={(measurementId: MeasurementId) => removeMeasurementFromChart(chartId, measurementId)}
                    />
                </>) 
                : "Error: No measurements found"}
            </div>
        </div>
    );
});
