import styles from "./ChartWithLegend.module.scss";
import Legend from "./Legend/Legend";
import { ChartElement } from "components/ChartMenu/ChartElement";
import { DragEvent } from "react";
import { MdClose } from "react-icons/md";
import { LinesChart } from "./LinesChart/LinesChart";

type Props = {
    chartElement: ChartElement;
    handleDropOnChart: (chartId: string, measurementId: string) => void;
    removeElement: () => void;
    removeMeasurement: (id: string) => void;
};

export const Chart = ({
    chartElement,
    handleDropOnChart,
    removeElement,
    removeMeasurement,
}: Props) => {
    function handleDrop(ev: DragEvent<HTMLDivElement>) {
        ev.stopPropagation();
        handleDropOnChart(
            chartElement.id,
            ev.dataTransfer.getData("text/plain")
        );
    }
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
            <LinesChart
                lineDescriptions={chartElement.lineDescriptions}
                gridDivisions={5}
            />
            <Legend
                legendItems={chartElement.lineDescriptions}
                removeItem={removeMeasurement}
            ></Legend>
            <MdClose
                className={styles.removeBtn}
                onClick={removeElement}
            />
        </div>
    );
};
