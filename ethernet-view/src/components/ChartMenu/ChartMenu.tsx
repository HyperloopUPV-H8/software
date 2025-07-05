import styles from "components/ChartMenu/ChartMenu.module.scss";
import { DragEvent, memo, useCallback } from "react";
import Sidebar from "components/ChartMenu/Sidebar/Sidebar";
import { Section } from "./Sidebar/Section/Section";
import { MeasurementId, useMeasurementsStore } from "common";
import { nanoid } from "nanoid";
import { ChartElement } from "./ChartElement/ChartElement";

export type ChartId = string;

export type ChartInfo = {
    chartId: ChartId;
    initialMeasurementId: MeasurementId;
};

interface Props {
    sidebarSections: Section[];
    charts: ChartInfo[];
    setCharts: React.Dispatch<React.SetStateAction<ChartInfo[]>>;
    measurementsByChart: Record<ChartId, MeasurementId[]>;
    setMeasurementsByChart: React.Dispatch<React.SetStateAction<Record<ChartId, MeasurementId[]>>>;
}

export const ChartMenu = memo(({ sidebarSections, charts, setCharts, measurementsByChart, setMeasurementsByChart }: Props) => {
    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);

    const addChart = (chartId: ChartId, initialMeasurementId: MeasurementId) => {
        setCharts(prev => [...prev, { chartId, initialMeasurementId }]);
        setMeasurementsByChart(prev => ({ ...prev, [chartId]: [initialMeasurementId] }));
    };

    const removeChart = useCallback((chartId: ChartId) => {
        setCharts(prevCharts => prevCharts.filter(chart => chart.chartId !== chartId));
        setMeasurementsByChart(prev => {
            const copy = { ...prev };
            delete copy[chartId];
            return copy;
        });
    }, [setCharts, setMeasurementsByChart]);
    
    const handleDrop = (ev: DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
        const id = ev.dataTransfer.getData("id");
        const initialMeasurementId = getNumericMeasurementInfo(id).id;
        addChart(nanoid(), initialMeasurementId);
    };

    if (sidebarSections.length == 0) {
        return (
            <div className={styles.noValues}>
                No available values to chart. This might happen if none of the
                measurements are numeric (only numeric measurements are
                chartable).
            </div>
        );
    } else {
        return (
            <div className={styles.chartMenuWrapper}>
                <Sidebar sections={sidebarSections} />
                <div
                    className={styles.chartListWrapper}
                    onDrop={handleDrop}
                    onDragEnter={(ev) => ev.preventDefault()}
                    onDragOver={(ev) => ev.preventDefault()}
                >
                    {charts.map((chart) => (
                        <ChartElement
                            key={chart.chartId}
                            chartId={chart.chartId}
                            initialMeasurementId={chart.initialMeasurementId}
                            removeChart={removeChart}
                            measurementsInChart={measurementsByChart[chart.chartId] || []}
                            setMeasurementsInChart={(measurementIds) => setMeasurementsByChart(prev => ({ ...prev, [chart.chartId]: measurementIds }))}
                        />
                    ))}
                </div>
            </div>
        );
    }
});

