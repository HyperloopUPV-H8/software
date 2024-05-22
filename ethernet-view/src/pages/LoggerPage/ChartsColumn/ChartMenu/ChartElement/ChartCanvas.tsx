import {
    ColorType,
    createChart,
    IChartApi,
    UTCTimestamp,
} from 'lightweight-charts';
import { ChartPoint } from 'pages/LoggerPage/LogsColumn/LogLoader/LogsProcessor';
import { useEffect, useRef } from 'react';
import { MeasurementLogger } from './ChartElement';

const CHART_HEIGHT = 300;

interface Props {
    measurementsInChart: MeasurementLogger[];
    getDataFromLogSession: (measurement: string) => ChartPoint[];
}

export const ChartCanvas = ({
    measurementsInChart,
    getDataFromLogSession,
}: Props) => {
    const chart = useRef<IChartApi | null>(null);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (chartContainerRef.current)
                if (chart)
                    chart.current?.applyOptions({
                        width: chartContainerRef.current.clientWidth,
                    });
        };

        const resizeObserver = new ResizeObserver(handleResize);
        if (chartContainerRef.current)
            resizeObserver.observe(chartContainerRef.current);

        if (chartContainerRef.current) {
            if (chart)
                chart.current = createChart(chartContainerRef.current, {
                    layout: {
                        background: { type: ColorType.Solid, color: 'white' },
                        textColor: 'black',
                    },
                    width: chartContainerRef.current.clientWidth,
                    height: CHART_HEIGHT,
                    timeScale: {
                        timeVisible: true,
                        fixLeftEdge: true,
                        fixRightEdge: true,
                        lockVisibleTimeRangeOnResize: true,
                        tickMarkFormatter: (time: UTCTimestamp) => {
                            const date = new Date(time * 1000);
                            return date.toLocaleTimeString() + '.' + date.getMilliseconds();
                        },    
                    },
                    localization: {
                        timeFormatter: (time: UTCTimestamp) => {
                            const date = new Date(time * 1000);
                            return date.toLocaleTimeString() + '.' + date.getMilliseconds();
                        }
                    }
                });
        }

        for (const measurement of measurementsInChart) {
            const data = getDataFromLogSession(measurement.id);
            const series = chart.current?.addLineSeries({
                color: measurement.color,
                priceFormat: {
                    type: 'price',
                    precision: 3,
                    minMove: 0.001,
                },
            });
            for (const point of data) {
                series?.update({
                    time: (point.time / 1000) as UTCTimestamp,
                    value: point.value,
                });
            }
        }

        return () => {
            resizeObserver.disconnect();
            chart.current?.remove();
        };
    }, [measurementsInChart]);

    return <div ref={chartContainerRef}></div>;
};
