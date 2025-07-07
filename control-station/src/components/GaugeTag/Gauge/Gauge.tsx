import { Arc } from './Arc/Arc';
import { BackgroundArc } from './BackgroundArc/BackgroundArc';
import styles from 'components/GaugeTag/Gauge/Gauge.module.scss';
import { useState } from 'react';
import { useGlobalTicker, useMeasurementsStore } from 'common';
import { current } from '@reduxjs/toolkit';
import { getPercentageFromRange } from 'state';

type Props = {
    id: string;
    sweep: number;
    strokeWidth: number;
    measurementId: string;       
};

export const Gauge = ({
    id,
    sweep,
    strokeWidth,
    measurementId
}: Props) => {
    const radius = 250;
    const center = radius;

    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);

    const Current = getNumericMeasurementInfo(measurementId);
    const [CurrentValue, setCurrent] = useState<number>(0);

    const maxCurrent = Current.range[1] ?? 100

    const percentage = getPercentageFromRange(CurrentValue, 0, maxCurrent)

    useGlobalTicker(() => {
        setCurrent(Current.getUpdate);
    });

    return (
        <svg
            className={styles.gaugeContainer}
            width="100%"
            height="auto"
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            preserveAspectRatio="xMidYMid meet"
        >
            <Arc
                className={styles.backgroundArc}
                sweep={sweep}
                radius={radius}
                strokeWidth={strokeWidth}
                percentage={100}
            />
            <BackgroundArc
                sweep={sweep}
                className={styles.rainbowArc}
                id={id}
                percentage={percentage}
                radius={radius}
                strokeWidth={strokeWidth}
            />
            <text
                x={center}
                y={center - 50}
                textAnchor="middle"
                className={styles.gaugeLabel}
            >
                Current
            </text>
            <text
                x={center}
                y={center + 10}
                textAnchor="middle"
                className={styles.gaugeValue}
            >
                {CurrentValue.toFixed(2)}
            </text>
            <text
                x={center}
                y={center + 45}
                textAnchor="middle"
                className={styles.gaugeUnits}
            >
                {Current.units}
            </text>
        </svg>
    );
};