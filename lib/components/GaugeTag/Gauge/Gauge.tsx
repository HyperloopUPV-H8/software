import { useEffect, useMemo } from "react";
import { clampAndNormalize } from "../../../math";
import { Arc } from "./Arc/Arc";
import { BackgroundArc } from "./BackgroundArc/BackgroundArc";
import styles from "./Gauge.module.scss";

type Props = {
    className: string;
    sweep: number;
    strokeWidth: number;
    value: number;
    min: number;
    max: number;
};

export const Gauge = ({
    className,
    sweep,
    strokeWidth,
    value,
    min,
    max,
}: Props) => {
    const radius = 500;
    const percentage = useMemo(() => {
        if (min >= max) {
            return 0;
        } else {
            return clampAndNormalize(value, min, max) * 100;
        }
    }, [value, min, max]);

    useEffect(() => {
        if (min >= max) {
            console.warn(`min (${min}) should be lower than max (${max})`);
        }
    }, [min, max]);

    return (
        <svg
            className={className}
            width="1em"
            height="1em"
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <Arc
                className={styles.backgroundArc}
                sweep={sweep}
                radius={radius}
                strokeWidth={strokeWidth}
                percentage={100}
            ></Arc>

            <BackgroundArc
                sweep={sweep}
                className={styles.rainbowArc}
                percentage={percentage}
                radius={radius}
                strokeWidth={strokeWidth}
            ></BackgroundArc>

            <BackgroundArc
                sweep={sweep}
                className={styles.radialShadowArc}
                percentage={percentage}
                radius={radius}
                strokeWidth={strokeWidth}
            ></BackgroundArc>
        </svg>
    );
};
