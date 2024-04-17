import { ColorType, createChart, IChartApi } from "lightweight-charts";
import { ChartPoint } from "pages/LoggerPage/LogsColumn/LogLoader/LogsProcessor";
import { useEffect, useRef } from "react";

const CHART_HEIGHT = 300;

interface Props {
    data: ChartPoint[];
}

export const ChartCanvas = ({ data }: Props) => {
    const chart = useRef<IChartApi | null>(null);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (chartContainerRef.current)
            if(chart)
            chart.current?.applyOptions({ width: chartContainerRef.current.clientWidth });
        };

        const resizeObserver = new ResizeObserver(handleResize);
        if (chartContainerRef.current)
        resizeObserver.observe(chartContainerRef.current);

        if (chartContainerRef.current) {
            if(chart)
            chart.current = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: "white" },
                    textColor: "black",
                },
                width: chartContainerRef.current.clientWidth,
                height: CHART_HEIGHT,
                timeScale: {
                    timeVisible: true,
                    secondsVisible: true,
                    fixLeftEdge: true,
                    fixRightEdge: true,
                    lockVisibleTimeRangeOnResize: true,
                    rightBarStaysOnScroll: true,
                },
            });

            chart.current?.addLineSeries().setData(data)
        }

        return () => {
            resizeObserver.disconnect();
            chart.current?.remove();
        }
    }, []);

    return (
        <div ref={chartContainerRef}></div>
    )
}
