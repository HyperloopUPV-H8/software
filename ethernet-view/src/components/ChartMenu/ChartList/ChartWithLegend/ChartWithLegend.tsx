import styles from "./ChartWithLegend.module.scss";
import Legend from "./Legend/Legend";
import { ChartElement } from "components/ChartMenu/ChartElement";
import { DragEvent } from "react";
import { MdClose } from "react-icons/md";
import { LinesChart, NumericMeasurement, getMeasurement, useMeasurementsStore } from "common";

type Props = {
    chartElement: ChartElement;
    handleDropOnChart: (chartId: string, lineId: string) => void;
    removeElement: () => void;
    removeMeasurement: (id: string) => void;
};

export const ChartWithLegend = ({
    chartElement,
    handleDropOnChart,
    removeElement,
    removeMeasurement,
}: Props) => {
    function handleDrop(ev: DragEvent<HTMLDivElement>) {
        ev.stopPropagation();
        const id = ev.dataTransfer.getData("id");
        handleDropOnChart(chartElement.id, id);
    }

    const measurements = useMeasurementsStore((state) => state.measurements);

    return (
        <div
            className={styles.chartWrapper}
            onDragEnter={(ev) => {
                ev.preventDefault();
            }}
            onDragOver={(ev) => {
                ev.preventDefault();
            }}
            onDrop={handleDrop}
        >
            <div className={styles.chart}>
                <LinesChart
                    divisions={6}
                    showGrid={true}
                    items={chartElement.lines}
                    length={1000}
                ></LinesChart>
            </div>
            <Legend
                items={chartElement.lines}
                getValue={(id) => {
                    const meas = getMeasurement(
                        measurements,
                        id
                    ) as NumericMeasurement;

                    return meas.value.last;
                }}
                removeItem={removeMeasurement}
            ></Legend>
            <MdClose
                className={styles.removeBtn}
                onClick={removeElement}
            />
        </div>
    );
};
