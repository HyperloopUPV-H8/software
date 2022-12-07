import { useSelector } from "react-redux";
import { RootState } from "store";
import { Sidebar } from "@components/ChartMenu/Sidebar/Sidebar";
import styles from "@components/ChartMenu/ChartMenu.module.scss";
import { Chart } from "@components/ChartMenu/Chart/Chart";
import { DragEvent, useState, useEffect, useRef } from "react";
import { ChartElement, LineFigure } from "@components/ChartMenu/ChartElement";
import { selectMeasurementByName } from "@models/PodData/PodData";
export const ChartMenu = () => {
  let boards = useSelector((state: RootState) => state.podData.boards);
  let [chartElements, setChartElements] = useState([] as ChartElement[]);
  let chartIndex = useRef(0);

  useEffect(() => {
    setOrderedChartElements((prevChartElements) => {
      return prevChartElements.map((chartElement) => {
        let newLines = chartElement.lines.map((line) => {
          let newValue = selectMeasurementByName(boards, line.name)
            .value as number;
          let newVector = [...line.vector, newValue];
          if (newVector.length > 200) {
            newVector = newVector.slice(newVector.length - 200);
          }
          return {
            name: line.name,
            vector: newVector,
            color: line.color,
          };
        });
        return { id: chartElement.id, lines: newLines };
      });
    });
  }, [boards]);

  function setOrderedChartElements(
    callback: (prevValues: ChartElement[]) => ChartElement[]
  ): void {
    setChartElements((prevValues) => {
      return callback(prevValues).sort((first, second) => first.id - second.id);
    });
  }

  function addChartElement(element: ChartElement) {
    setOrderedChartElements((prevValues) => {
      return [...prevValues, element];
    });
  }

  function handleDrop(ev: DragEvent<HTMLDivElement>) {
    addChartElement({
      id: chartIndex.current,
      lines: [
        {
          name: ev.dataTransfer.getData("text/plain"),
          vector: [],
          color: { h: 32, s: 60, l: 80 },
        },
      ],
    });
    chartIndex.current++;
  }

  function handleDropOnChart(id: number, measurementName: string) {
    let chartElement = chartElements.find((element) => element.id == id)!;
    if (isAlreadyInChart(chartElement, measurementName)) {
      return;
    }
    let newH = (32 + chartElement.lines.length * 123) % 360;
    let newChartElement = {
      ...chartElement,
      lines: [
        ...chartElement.lines,
        {
          name: measurementName,
          vector: [0],
          color: {
            h: newH,
            s: 60,
            l: 80,
          },
        },
      ],
    } as ChartElement;
    let restOfElements = chartElements.filter((element) => element.id != id);
    setOrderedChartElements(() => {
      return [...restOfElements, newChartElement];
    });
  }

  function isAlreadyInChart(
    chartElement: ChartElement,
    measurementName: string
  ): boolean {
    return (
      chartElement.lines.findIndex((line) => line.name == measurementName) != -1
    );
  }

  return (
    <div id={styles.wrapper}>
      <Sidebar boards={boards} />
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
            />
          );
        })}
      </div>
    </div>
  );
};
