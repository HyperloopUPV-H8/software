import styles from "./ChartElement.module.scss";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useMeasurementsStore } from 'common';
import { ChartCanvas } from './ChartCanvas/ChartCanvas';
import { ChartLegend } from './ChartLegend/ChartLegend';
import { ChartId, useChartStore } from "../ChartStore";

type Props = {
    chartId: ChartId;
};

// React component that keeps the chart render and measurements represented on it.
export const ChartElement = ({ chartId }: Props) => {

    const addMeasurementToChart = useChartStore(state => state.addMeasurementToChart);
    const removeChart = useChartStore(state => state.removeChart);
    const getNumericMeasurementInfo = useMeasurementsStore(state => state.getNumericMeasurementInfo);

    const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
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
                <ChartCanvas 
                    chartId={chartId}
                />
                <ChartLegend
                    chartId={chartId}
                />
            </div>
        </div>
    );
};
