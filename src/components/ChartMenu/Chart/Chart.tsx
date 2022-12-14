import styles from "@components/ChartMenu/Chart/Chart.module.scss";
import Legend from "@components/ChartMenu/Chart/Legend/Legend";
import { ChartElement } from "@components/ChartMenu/ChartElement";
import { DragEvent, useCallback } from "react";
import LinesCanvas from "@components/ChartMenu/Chart/LinesCanvas/LinesCanvas";
import { IoMdCloseCircle } from "react-icons/io";
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
      handleDropOnChart(chartElement.id, ev.dataTransfer.getData("text/plain"));
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
      onDrop={handleDrop}
    >
      <div className={styles.removeBtn} onClick={removeElement}>
        <IoMdCloseCircle />
      </div>
      <div className={styles.chartWrapper}>
        <LinesCanvas key={chartElement.id} lineFigures={chartElement.lines} />
      </div>
      <Legend
        legendItems={chartElement.lines}
        removeItem={removeLineItem}
      ></Legend>
    </div>
  );
};
