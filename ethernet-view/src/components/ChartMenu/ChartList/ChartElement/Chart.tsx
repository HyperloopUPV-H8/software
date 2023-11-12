// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';
import { useGlobalTicker } from 'common';
import { ChartInfo } from "components/ChartMenu/types"
import { MutableRefObject, useRef, useState } from 'react';
 
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

type Props = {
    chartInfo: ChartInfo;
    removeElement: (id: string) => void;
}

interface Point {
    x: number,
    y: number,
}

const MAX_VALUES = 1000;

const insertPoint = (points: Point[], value: number) : Point[] => {
    if(points.length == 0) {
        points.push({x: 0, y: value})
        return points
    }
    const lastx = points[points.length - 1].x
    points.push({x: lastx + 1, y: value})
    if(points.length >= MAX_VALUES) {
        points.shift()
    }
    return points
}

export const Chart = ({ chartInfo, removeElement } : Props) => {

    const [points, setPoints] = useState<Point[]>([])

    let chartRef = useRef<MutableRefObject<undefined>>();

    useGlobalTicker(() => {
        const newPointsList = insertPoint(points, chartInfo.getUpdate())
        setPoints(newPointsList)
        if (chartRef.current) {
            (chartRef.current as any).render();
        }
    })

    const chartOptions = {
        height: 300,
        data: [
            {
                type: "line",
                showInLegend: true,
                name: chartInfo.name,
                color: chartInfo.color,
                dataPoints: points
            }
        ],
        legend: {
            fontSize: 16,
            cursor: "pointer",
            itemclick: (event: any) => {
                event.chart.data[event.dataSeriesIndex].remove();
                removeElement(chartInfo.name)
            }
            // itemclick: function (e: any) {
            //     //console.log("legend click: " + e.dataPointIndex);
            //     //console.log(e);
            //     if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            //         e.dataSeries.visible = false;
            //     } else {
            //         e.dataSeries.visible = true;
            //     }
 
            //     e.chart.render();
            // }
        },
    }

    return (
            <CanvasJSChart
                options={chartOptions}
                onRef={(ref: MutableRefObject<undefined>) => {chartRef.current = ref;}}
            />
    )
}
