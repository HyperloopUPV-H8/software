// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';
import { ChartInfo, MeasurementInfo, Point } from "components/ChartMenu/types";
import styles from "./ChartElement.module.scss";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { MutableRefObject, useCallback, useRef } from "react";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const MAX_VALUE = 1000;

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

    let chartData = chart.measurements.map((measurement) => {
        return {
            type: "line",
            showInLegend: true,
            name: measurement.name,
            color: measurement.color,
            dataPoints: [] as Point[],
        }
    });

    const currentX = useRef(0);

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
                            }
                        },
                    }}
                onRef={(ref: MutableRefObject<undefined>) => {chartRef.current = ref;}}
            />
            </div>
        </div>
    );
};
