import { ChartElement } from "components/ChartMenu/ChartElement";
import { Chart } from "components/ChartMenu/Chart/Chart";
import { useChartElements } from "components/ChartMenu/useChartElements";
import { store } from "../../../store";
import { getMeasurement } from "models/PodData/PodData";
import { DragEvent } from "react";
import { useInterval } from "hooks/useInterval";

import styles from "components/ChartMenu/ChartList/ChartList.module.scss";

export const ChartList = () => {
    const [
        chartElements,
        addElement,
        addLineToElement,
        updateElements,
        removeElement,
        removeLineItem,
    ] = useChartElements();

    function getUpdatedMeasurements(): Map<string, number> {
        let state = store.getState();
        let measurements = new Map<string, number>();
        for (let element of chartElements) {
            for (let [name, _] of element.lines) {
                measurements.set(
                    name,
                    getMeasurement(state.podData.boards, name).value as number
                );
            }
        }
        return measurements;
    }

    useInterval(() => {
        updateElements(getUpdatedMeasurements());
    }, 1000 / 60);

    function handleDrop(ev: DragEvent<HTMLDivElement>) {
        addElement(ev.dataTransfer.getData("text/plain"));
    }

    function handleDropOnChart(id: number, measurementName: string) {
        addLineToElement(id, measurementName);
    }

    return (
        <div
            className={styles.wrapper}
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
                        removeElement={() => removeElement(chartElement.id)}
                        removeLineItem={(lineId: string) => {
                            removeLineItem(chartElement.id, lineId);
                        }}
                    />
                );
            })}
        </div>
    );
};
