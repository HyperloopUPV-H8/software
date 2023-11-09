import { Chart } from "canvasjs";
import styles from "./ChartElement.module.scss";
import { ChartType } from "components/ChartMenu/ChartTypes";
import { useEffect } from "react";
// @ts-ignore
import CanvasJS from "@canvasjs/charts";

type Props = {
    chartElement: ChartType;
    removeElement: () => void;
    setCanvas: (canvas: Chart) => void;
};

export const ChartElement = ({ chartElement, setCanvas } : Props) => {

    useEffect(() => {
      /**
       * TODO: 1. Create Chart object
       * 2. Add with setCanvas with the chartElement.id
       * 3. Render
       */

      const chartCanvas = new CanvasJS.Chart(chartElement.id, {
        title: {},
        data: [
            {
                dataPoints: []
            }
        ]
      })

      setCanvas(chartCanvas)

      chartCanvas.render();
    
    }, [])
    


    return (
        <div
            className={styles.chartWrapper}
            onDragEnter={(ev) => ev.preventDefault() }
            onDragOver={(ev) => ev.preventDefault() }
        >
            {/* <div className={styles.chart}>
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
                        store.getState().measurements,
                        id
                    ) as NumericMeasurement;

                    return meas.value.last;
                }}
                removeItem={removeMeasurement}
            ></Legend>
            <MdClose
                className={styles.remov1eBtn}
                onClick={removeElement}
            /> */}
            <div id={chartElement.id}></div>
        </div>
    );
};
