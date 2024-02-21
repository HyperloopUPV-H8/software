import styles from "./ChartElement.module.scss";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { MeasurementId, NumericMeasurementInfo, useMeasurementsStore } from 'common';
import { ChartId } from '../ChartMenu';
import { ChartCanvas } from './ChartCanvas/ChartCanvas';
import { ChartLegend } from './ChartLegend/ChartLegend';
import { memo, useState } from "react";

type Props = {
    chartId: ChartId;
    initialMeasurement: NumericMeasurementInfo;
    removeChart(chartId: ChartId): void;
};

// React component that keeps the chart render and measurements represented on it.
export const ChartElement = memo(({ chartId, initialMeasurement, removeChart }: Props) => {
    const [measurementsInChart, setMeasurementsInChart] = useState<NumericMeasurementInfo[]>([initialMeasurement]);
    const getNumericMeasurementInfo = useMeasurementsStore(state => state.getNumericMeasurementInfo);

    const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        const id = ev.dataTransfer.getData("id");
        const measurementInfo = getNumericMeasurementInfo(id);
        setMeasurementsInChart([...measurementsInChart, measurementInfo]);
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
                <ChartCanvas 
                    measurements={measurementsInChart}
                />
                <ChartLegend
                    chartId={chartId}
                    measurements={measurementsInChart}
                    removeMeasurementFromChart={(measurementId: MeasurementId) => setMeasurementsInChart(measurementsInChart.filter(measurement => measurement.id !== measurementId))}
                    removeChart={removeChart}
                />
            </div>
        </div>
    );
});
