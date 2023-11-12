// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';
import { useGlobalTicker } from 'common';
import { ChartId, MeasurementInfo } from "components/ChartMenu/types"
import { MutableRefObject, useRef, useState } from 'react';
 
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

type Props = {
    chartId: ChartId,
    measurements: MeasurementInfo[],
    removeMeasurementFromChart: (chartId: string, measurementId: string) => void,
}

interface Point {
    x: number,
    y: number,
}

const MAX_VALUES = 1000;

const insertPoint = (pointsMap: Map<string, Point[]>, measurementId: string, value: number) : Point[] => {
    let points = pointsMap.get(measurementId)
    if(points) {
        if(points.length == 0) {
            points.push({x: 0, y: value})
            return points
        }
        const lastx = points[points.length - 1].x
        points.push({x: lastx + 1, y: value})
        if(points.length >= MAX_VALUES) {
            points.shift()
        }
    }
    return points || [];
}

export const Chart = ({ chartId, measurements, removeMeasurementFromChart } : Props) => {

    const [points, setPoints] = useState<Map<string, Point[]>>(new Map<string, Point[]>());

    let chartRef = useRef<MutableRefObject<undefined>>();

    // let chartData;

    // chartData = measurements.map((measurement) => {
    //     return {
    //         type: "line",
    //         showInLegend: true,
    //         name: measurement.name,
    //         color: measurement.color,
    //         dataPoints: points.get(measurement.id)
    //     }
    // });

    useGlobalTicker(() => {
        for(let measurement of measurements) {
            const newPointsList = insertPoint(points, measurement.id, measurement.getUpdate());
            points.set(measurement.id, newPointsList)
            setPoints(points)
            if (chartRef.current) {
                (chartRef.current as any).render();
            }
        }
    })

    return (
            <CanvasJSChart
                options={{
                    height: 300,
                    data: [],
                    legend: {
                        fontSize: 16,
                        cursor: "pointer",
                        itemclick: (event: any) => {
                            removeMeasurementFromChart(chartId, event.dataSeries.name);
                            event.chart.data[event.dataSeriesIndex].remove();
                        }
                    },
                }}
                onRef={(ref: MutableRefObject<undefined>) => {chartRef.current = ref;}}
            />
    )
}
