import { useSelector } from "react-redux";
import { useInterval } from "@hooks/useInterval";
import Sidebar from "@components/ChartMenu/Sidebar/Sidebar";
import styles from "@components/ChartMenu/ChartMenu.module.scss";
import { DragEvent, useEffect } from "react";
import { Chart } from "@components/ChartMenu/Chart/Chart";
import { selectPodDataNames } from "@slices/podDataSlice";
import lodash from "lodash";
import { useChartElements } from "./useChartElements";
import { store } from "../../store";
import { getMeasurement } from "@models/PodData/PodData";
export const ChartMenu = () => {
    let boardNodes = useSelector(selectPodDataNames, lodash.isEqual);

    const [
        chartElements,
        addElement,
        addLineToElement,
        updateElements,
        removeElement,
        removeLineItem,
    ] = useChartElements();

    function getUpdatedMeasurements(): Map<string, string> {
        let state = store.getState();
        let measurements = new Map<string, string>();
        for (let element of chartElements) {
            for (let [name, _] of element.lines) {
                measurements.set(
                    name,
                    //TODO: HACER QUE SOLO APAREZCAN EN EL SIDEBAR LOS QUE SON NUMEROS ASI NO HAY QUE CONVERTIR LUEGO
                    getMeasurement(state.podData.boards, name).value as string
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
        <div id={styles.wrapper}>
            <Sidebar boardNodes={boardNodes} />
            <div
                id={styles.chartList}
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
        </div>
    );
};
