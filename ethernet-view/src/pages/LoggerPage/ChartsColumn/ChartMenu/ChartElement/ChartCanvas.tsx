import { ColorType, createChart, IChartApi, UTCTimestamp } from "lightweight-charts";
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

        let date = Math.floor(Date.now() / 1000);

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
                    fixLeftEdge: true,
                    fixRightEdge: true,
                    lockVisibleTimeRangeOnResize: true,
                },
            });

            const series = chart.current?.addLineSeries({
                color: "red"
            })

            data.forEach((point) => {
                series?.update({ time: date++ as UTCTimestamp, value: point.value });
            })
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
