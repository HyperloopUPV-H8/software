import styles from "components/ChartMenu/Chart/Chart.module.scss";
import Legend from "components/ChartMenu/Chart/Legend/Legend";
import { ChartElement } from "components/ChartMenu/ChartElement";
import { DragEvent, useCallback } from "react";
import { SVGLineChart } from "components/ChartMenu/Chart/SVGLineChart/SVGLineChart";
import { MdClose } from "react-icons/md";

type Props = {
    chartElement: ChartElement;
    handleDropOnChart: (chartId: number, measurementName: string) => void;
    removeElement: () => void;
    removeLineItem: (id: string) => void;
};

export const Chart = ({
    chartElement,
    handleDropOnChart,
    removeElement,
    removeLineItem,
}: Props) => {
    const handleDrop = useCallback(
        (ev: DragEvent<HTMLDivElement>) => {
            ev.stopPropagation();
            handleDropOnChart(
                chartElement.id,
                ev.dataTransfer.getData("text/plain")
            );
        },
        [handleDropOnChart]
    );
    return (
        <div
            className={styles.wrapper}
            onDragEnter={(ev) => {
                ev.preventDefault();
            }}
            onDragOver={(ev) => {
                ev.preventDefault();
            }}
            //FIXME: no funciona si lo haces sobre el gráfico (sobre la parte pintada)
            onDrop={handleDrop}
        >
            <MdClose className={styles.removeBtn} onClick={removeElement} />
            <SVGLineChart lineFigures={chartElement.lines}></SVGLineChart>
            <Legend
                legendItems={chartElement.lines}
                removeItem={removeLineItem}
            ></Legend>
        </div>
    );
};
