import styles from "./ChartList.module.scss";
import { Chart } from "./Chart/ChartWithLegend";
import { DragEvent, useCallback } from "react";
import { useCharts } from "../useCharts";
import { store } from "store";
import { NumericMeasurement, getMeasurement } from "common";
import { parseId } from "../parseId";

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
            color: "red",
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
                console.error(`measurement ${measId} not found in store`);
                return;
            }

            addLine(id, {
                id: measId,
                name: meas.name,
                units: meas.units,
                color: "red",
                getUpdate: () => {
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
                    <Chart
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
