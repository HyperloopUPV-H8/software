// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';
import { ChartInfo, MeasurementInfo, Point } from "components/ChartMenu/types";
import styles from "./ChartElement.module.scss";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { MutableRefObject, useCallback, useRef } from "react";
import { useInterval } from 'common';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const MAX_VALUE = 300;

type Props = {
    chart: ChartInfo;
    removeChart: (id: string) => void;
    getMeasurementInfo: (id: string) => MeasurementInfo;
    addMeasurementToChart: (chartId: string, measurementInfo: MeasurementInfo) => void;
    removeMeasurementFromChart: (chartId: string, measurementName: string) => void;
};

export const ChartElement = ({ chart, removeChart, getMeasurementInfo, addMeasurementToChart, removeMeasurementFromChart }: Props) => {

    const handleDropOnChart = useCallback((ev: any) => {
        ev.stopPropagation();
        const measurementId = ev.dataTransfer.getData("id");
        const measurement = getMeasurementInfo(measurementId);
        addMeasurementToChart(chart.chartId, measurement);
    }, []);

    const chartData = chart.measurements.map((measurement) => {
        return {
            type: "line",
            showInLegend: true,
            name: measurement.name,
            color: measurement.color,
            dataPoints: [] as Point[],
        }
    });

    let {current: currentX} = useRef(0);

    useInterval(() => {
        for(let measurement of chart.measurements) {
            const dataPoints = chartData.find((data) => data.name === measurement.name)?.dataPoints;
            if(dataPoints) {
                const point = {
                    x: currentX,
                    y: measurement.getUpdate(),
                };
                dataPoints.push(point);
                if(dataPoints.length > MAX_VALUE) {
                    dataPoints.shift();
                }
            }
        }
        chartRef.current?.render();
        currentX++;
    }, 5);

    let chartRef = useRef<typeof CanvasJSChart>();

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
                    onClick={() => removeChart(chart.chartId)}
                />
                <CanvasJSChart
                    options={{
                        height: 300,
                        data: chartData,
                        legend: {
                            fontSize: 16,
                            cursor: "pointer",
                            itemclick: (event: any) => {
                                removeMeasurementFromChart(chart.chartId, event.dataSeries.name);
                                event.chart.data[event.dataSeriesIndex].remove();
                                if(event.chart.data.length === 0) {
                                    removeChart(chart.chartId);
                                }
                            }
                        },
                    }}
                onRef={(ref: MutableRefObject<undefined>) => {chartRef.current = ref;}}
            />
            </div>
        </div>
    );
};
