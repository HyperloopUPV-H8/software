import { useSelector } from "react-redux";
import { RootState } from "store";
import { Sidebar } from "@components/ChartMenu/Sidebar/Sidebar";
import styles from "@components/ChartMenu/ChartMenu.module.scss";
import { Chart } from "@components/ChartMenu/Chart/Chart";
import { DragEvent, useState, useEffect, useRef } from "react";
import { ChartElement } from "./ChartElement";
import { selectMeasurementByName } from "@models/PodData/PodData";
export const ChartMenu = () => {
  let boards = useSelector((state: RootState) => state.podData.boards);
  let [chartElements, setChartElements] = useState([] as ChartElement[]);
  let chartIndex = useRef(0);

  useEffect(() => {
    setOrderedChartElements((prevChartElements) => {
      return prevChartElements.map((chartElement) => {
        let newVariables = chartElement.variables.map((variable) => {
          let newValue = selectMeasurementByName(boards, variable.name)
            .value as number;
          let newVector = [...variable.vector, newValue];
          if (newVector.length > 200) {
            newVector = newVector.slice(newVector.length - 200);
          }
          return {
            name: variable.name,
            vector: newVector,
          };
        });
        return { id: chartElement.id, variables: newVariables };
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
      variables: [{ name: ev.dataTransfer.getData("text/plain"), vector: [] }],
    });
    chartIndex.current++;
  }

  function handleDropOnChart(id: number, measurementName: string) {
    let chartElement = chartElements.find((element) => element.id == id)!;
    if (isAlreadyInChart(chartElement, measurementName)) {
      return;
    }
    let newChartElement = {
      ...chartElement,
      variables: [
        ...chartElement.variables,
        { name: measurementName, vector: [0] },
      ],
    };
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
      chartElement.variables.findIndex(
        (variable) => variable.name == measurementName
      ) != -1
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
