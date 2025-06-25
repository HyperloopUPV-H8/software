import styles from "./ChartElement.module.scss";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { MeasurementId, NumericMeasurementInfo, useMeasurementsStore } from 'common';
import { ChartCanvas } from './ChartCanvas/ChartCanvas';
import { ChartLegend } from './ChartLegend/ChartLegend';
import { memo } from "react";
import { ChartId } from "../ChartMenu";

interface Props {
    chartId: ChartId;
    initialMeasurementId: MeasurementId;
    removeChart: (chartId: ChartId) => void;
    measurementsInChart: MeasurementId[];
    setMeasurementsInChart: (ids: MeasurementId[]) => void;
}

// React component that keeps the chart render and measurements represented on it.
export const ChartElement = memo(({ chartId, initialMeasurementId, removeChart, measurementsInChart, setMeasurementsInChart }: Props) => {
    const getNumericMeasurementInfo = useMeasurementsStore(state => state.getNumericMeasurementInfo);
    const measurementInfos: NumericMeasurementInfo[] = measurementsInChart.map(getNumericMeasurementInfo);

    const addMeasurementToChart = (measurement: NumericMeasurementInfo) => {
        if(!measurementsInChart.includes(measurement.id)) {
            setMeasurementsInChart([...measurementsInChart, measurement.id]);
        }
    }

    const removeMeasurementFromChart = (measurementId: MeasurementId) => {
        setMeasurementsInChart(measurementsInChart.filter(id => id !== measurementId));
    };

    const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        const id = ev.dataTransfer.getData("id");
        const measurementInfo = getNumericMeasurementInfo(id);
        addMeasurementToChart(measurementInfo);
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
                    measurementsInChart={measurementInfos}
                />
                <ChartLegend
                    chartId={chartId}
                    measurementsInChart={measurementInfos}
                    removeMeasurementFromChart={removeMeasurementFromChart}
                    removeChart={removeChart}
                />
            </div>
        </div>
    );
});
