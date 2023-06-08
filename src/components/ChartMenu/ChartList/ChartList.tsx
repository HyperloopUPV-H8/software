import styles from "./ChartList.module.scss";
import { ChartWithLegend } from "./ChartWithLegend/ChartWithLegend";
import { DragEvent, useCallback } from "react";
import { useCharts } from "../useCharts";
import { store } from "store";
import { NumericMeasurement, getMeasurement } from "common";
import { parseId } from "../parseId";

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r}, ${g}, ${b})`;
}

export const ChartList = () => {
    const { charts, addChart, removeChart, addLine, removeLine } = useCharts();

    const handleDrop = useCallback((ev: DragEvent<HTMLDivElement>) => {
        const itemId = ev.dataTransfer.getData("id");
        const ids = parseId(itemId);
        const meas = getMeasurement(
            store.getState().measurements,
            ids.boardId,
            ids.measId
        ) as NumericMeasurement;

        if (!meas) {
            return;
        }

        addChart(itemId, {
            id: itemId,
            name: meas.name,
            units: meas.units,
            range: meas.safeRange,
            getUpdate: () => {
                //TODO: change to getNumericMeasurement and return undefined if its not numeric (olr doesnt exist)
                const meas = getMeasurement(
                    store.getState().measurements,
                    ids.boardId,
                    ids.measId
                ) as NumericMeasurement;

                if (!meas) {
                    return 0;
                }

                return meas.value.last;
            },
            color: getRandomColor(),
        });
    }, []);

    const handleDropOnChart = useCallback(
        (id: string, boardId: string, measId: string) => {
            const meas = getMeasurement(
                store.getState().measurements,
                boardId,
                measId
            ) as NumericMeasurement;

            if (!meas) {
                console.trace(`measurement ${measId} not found in store`);
                return;
            }

            addLine(id, {
                id: `${boardId}/${measId}`,
                name: meas.name,
                units: meas.units,
                color: getRandomColor(),
                getUpdate: () => {
                    const meas = getMeasurement(
                        store.getState().measurements,
                        boardId,
                        measId
                    ) as NumericMeasurement;

                    if (!meas) {
                        return 0;
                    }

                    return meas.value.last;
                },
                range: meas.safeRange,
            });
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
            {charts.map((chart) => {
                return (
                    <ChartWithLegend
                        key={chart.id}
                        chartElement={chart}
                        handleDropOnChart={handleDropOnChart}
                        removeElement={() => {
                            removeChart(chart.id);
                        }}
                        removeMeasurement={(measurementId: string) => {
                            removeLine(chart.id, measurementId);
                        }}
                    />
                );
            })}
        </div>
    );
};
