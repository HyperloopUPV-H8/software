import styles from "./ChartWithLegend.module.scss";
import Legend from "./Legend/Legend";
import { ChartElement } from "components/ChartMenu/ChartElement";
import { DragEvent } from "react";
import { MdClose } from "react-icons/md";
import { LinesChart, NumericMeasurement, getMeasurement } from "common";
import { store } from "store";
import { parseId } from "components/ChartMenu/parseId";

type Props = {
    chartElement: ChartElement;
    handleDropOnChart: (
        id: string,
        boardId: string,
        measurementId: string
    ) => void;
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

        handleDropOnChart(chartElement.id, ids.boardId, ids.measId);
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
                divisions={10}
                grid={true}
                items={chartElement.lines}
                length={100}
                height="10rem"
            ></LinesChart>
            <Legend
                items={chartElement.lines}
                removeItem={removeMeasurement}
            ></Legend>
            <MdClose
                className={styles.removeBtn}
                onClick={removeElement}
            />
        </div>
    );
};
