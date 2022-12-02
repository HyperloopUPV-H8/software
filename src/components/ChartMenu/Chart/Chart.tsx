import styles from "@components/ChartMenu/Chart/Chart.module.scss";
import { Legend } from "@components/ChartMenu/Chart/Legend/Legend";
import { ChartElement } from "@components/ChartMenu/ChartElement";
import { DragEvent } from "react";
import { LinesCanvas } from "@components/ChartMenu/Chart/LinesCanvas/LinesCanvas";
type Props = {
  chartElement: ChartElement;
  handleDropOnChart: (chartId: number, measurementName: string) => void;
};

export const Chart = ({ chartElement, handleDropOnChart }: Props) => {
  function handleDrop(ev: DragEvent<HTMLDivElement>) {
    ev.stopPropagation();
    handleDropOnChart(chartElement.id, ev.dataTransfer.getData("text/plain"));
  }

  return (
    <div
      id={styles.wrapper}
      onDragEnter={(ev) => {
        ev.preventDefault();
      }}
      onDragOver={(ev) => {
        ev.preventDefault();
      }}
      onDrop={handleDrop}
    >
      <div id={styles.chartWrapper}>
        <LinesCanvas
          key={chartElement.id}
          vectors={chartElement.variables.map((element) => {
            return element.vector.map((value, index) => {
              return { x: index, y: value };
            });
          })}
        />
      </div>
      <Legend
        names={chartElement.variables.map((variable) => {
          return variable.name;
        })}
      ></Legend>
    </div>
  );
};
