import styles from "@components/ChartMenu/Chart/Chart.module.scss";
import { Legend } from "@components/ChartMenu/Chart/Legend/Legend";
import { LineFigure } from "@components/ChartMenu/Chart/LineFigure/LineFigure";
import { Axis } from "@components/ChartMenu/Chart/Axis/Axis";
import { ChartElement } from "@components/ChartMenu/ChartElement";
import { DragEvent } from "react";
import { getNormalizedPoints } from "@utils/math";
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

  let initalColor = { h: 32, s: 60, l: 80 };

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
          figures={chartElement.variables.map((element, index) => {
            return {
              vector: element.vector.map((value, index) => {
                return { x: index, y: value };
              }),
              color: {
                h: (initalColor.h + index * 100) % 360,
                s: initalColor.s,
                l: initalColor.l,
              },
            };
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
