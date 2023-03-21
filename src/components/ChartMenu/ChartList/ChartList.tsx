import styles from "./ChartList.module.scss";
import { Chart } from "./Chart/ChartWithLegend";
import { useChartElements } from "components/ChartMenu/useChartElements";
import { DragEvent, useCallback } from "react";

export const ChartList = () => {
    const {
        chartElements,
        addElement,
        addMeasurementToElement,
        removeMeasurementFromElement,
        removeElement,
    } = useChartElements();

    const handleDrop = useCallback((ev: DragEvent<HTMLDivElement>) => {
        addElement(ev.dataTransfer.getData("text/plain"));
    }, []);

    const handleDropOnChart = useCallback(
        (id: string, measurementId: string) => {
            addMeasurementToElement(id, measurementId);
        },
        []
    );

    return (
        <div
            className={styles.chartListWrapper}
            onDrop={handleDrop}
            onDragEnter={(ev) => {
                ev.preventDefault();
            }}
            onDragOver={(ev) => {
                ev.preventDefault();
            }}
        >
            {chartElements.map((chartElement) => {
                return (
                    <Chart
                        key={chartElement.id}
                        chartElement={chartElement}
                        handleDropOnChart={handleDropOnChart}
                        removeElement={() => {
                            removeElement(chartElement.id);
                        }}
                        removeMeasurement={(measurementId: string) => {
                            removeMeasurementFromElement(
                                chartElement.id,
                                measurementId
                            );
                        }}
                    />
                );
            })}
        </div>
    );
};
