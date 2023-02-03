import { clampAndNormalize, toRadians } from "math";
import { Arc } from "./Arc/Arc";
import styles from "components/GaugeTag/Gauge/Gauge.module.scss";

type Props = {
    className: string;
    sweep: number;
    strokeWidth: number;
    value: number;
    min: number;
    max: number;
};

function getGaugeSize(radius: number, sweep: number): [number, number] {
    let width: number, height: number;

    if (sweep < 180) {
        width = 2 * radius * Math.sin(toRadians(sweep / 2));
        height = radius;
    } else {
        width = 2 * radius;
        height = radius + radius * Math.sin(toRadians(sweep / 2 - 90));
    }

    return [width, height];
}

export const Gauge = ({
    className,
    sweep,
    strokeWidth,
    value,
    min,
    max,
}: Props) => {
    const radius = 500;
    const percentage = clampAndNormalize(value, min, max) * 100;
    const [width, height] = getGaugeSize(radius, sweep);
    return (
        <svg
            className={className}
            width="1em"
            height="1em"
            // viewBox={`${radius - width / 2} 0 ${width} ${height}`}
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <Arc
                className={styles.backgroundArc}
                sweep={sweep}
                strokeWidth={strokeWidth}
                percentage={100}
                viewBoxLength={radius * 2}
            ></Arc>
            <defs>
                <mask id="myMask">
                    <Arc
                        className={styles.maskArc}
                        sweep={sweep}
                        strokeWidth={strokeWidth}
                        percentage={percentage}
                        viewBoxLength={radius * 2}
                    ></Arc>
                </mask>

                <radialGradient
                    id="myGradient"
                    r="55%"
                >
                    <stop
                        offset="40%"
                        stop-color="#c9c9c9a0"
                    />
                    <stop
                        offset="100%"
                        stop-color="#c9c9c900"
                    />
                </radialGradient>
            </defs>

            <foreignObject
                x="0"
                y="0"
                width="100%"
                height="100%"
                mask="url(#myMask)"
            >
                <div className={styles.gradientDiv} />
            </foreignObject>
            <Arc
                className={styles.radialShadowArc}
                sweep={sweep}
                strokeWidth={strokeWidth}
                percentage={percentage}
                viewBoxLength={radius * 2}
            ></Arc>
        </svg>
    );
};
