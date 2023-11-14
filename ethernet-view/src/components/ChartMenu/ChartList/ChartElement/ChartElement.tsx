// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';
import { ChartId, MeasurementId, MeasurementInfo, Point } from "components/ChartMenu/types";
import styles from "./ChartElement.module.scss";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { MutableRefObject, memo, useCallback, useEffect, useRef, useState } from "react";
import { useInterval } from 'common';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const MAX_VALUE = 300;

type Props = {
    chartId: ChartId;
    measurementId: MeasurementId;
    removeChart: (id: ChartId) => void;
    getMeasurementInfo: (id: string) => MeasurementInfo;
};

export const ChartElement = memo(({ chartId, measurementId, removeChart, getMeasurementInfo }: Props) => {

    const [measurements, setMeasurements] = useState<MeasurementInfo[]>([]);

    const handleDropOnChart = useCallback((ev: any) => {
        ev.stopPropagation();
        const measurementId = ev.dataTransfer.getData("id");
        const measurement = getMeasurementInfo(measurementId);
        setMeasurements((prev) => [...prev, measurement]);
    }, []);

    let currentX = useRef(0);
    let chartRef = useRef<typeof CanvasJSChart>();


    useEffect(() => {
        const measurement = getMeasurementInfo(measurementId);
        setMeasurements((prev) => [...prev, measurement]);
    }, [])
    

    const chartData = measurements.map((measurement) => {
        return {
            type: "line",
            showInLegend: true,
            name: measurement.name,
            color: measurement.color,
            dataPoints: [] as Point[],
        }
    });

    useInterval(() => {
        for(let measurement of measurements) {
            const dataPoints = chartData.find((data) => data.name === measurement.name)?.dataPoints;
            if(dataPoints) {
                const point = {
                    x: currentX.current,
                    y: measurement.getUpdate(),
                };
                dataPoints.push(point);
                if(dataPoints.length > MAX_VALUE) {
                    dataPoints.shift();
                }
            }
        }
        chartRef.current?.render();
        currentX.current = currentX.current + 1;
    }, 5);

    return (
        <div
            className={styles.chartWrapper}
            onDragEnter={(ev) => ev.preventDefault()}
            onDragOver={(ev) => ev.preventDefault()}
            onDrop={handleDropOnChart}
        >

            <div className={styles.chart}>
                <AiOutlineCloseCircle 
                    size={30}
                    cursor="pointer"
                    onClick={() => removeChart(chartId)}
                />
                <CanvasJSChart
                    options={{
                        height: 300,
                        data: chartData,
                        legend: {
                            fontSize: 16,
                            cursor: "pointer",
                            itemclick: (event: any) => {
                                event.chart.data[event.dataSeriesIndex].remove();
                                setMeasurements((prev) => prev.filter((measurement) => 
                                    (measurement.name !== event.dataSeries.name)
                                ));
                            }
                        },
                    }}
                onRef={(ref: MutableRefObject<undefined>) => {chartRef.current = ref;}}
            />
            </div>
        </div>
    );
});
