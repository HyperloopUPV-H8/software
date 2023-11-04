import styles from "./GaugeTag.module.scss";
import { Gauge } from "./Gauge/Gauge";

type Props = {
    className?: string;
    name: string;
    units: string;
    strokeWidth: number;
    value: number;
    min: number;
    max: number;
};
export const GaugeTag = ({
    className = "",
    name,
    units,
    strokeWidth,
    value,
    min,
    max,
}: Props) => {
    return (
        <article className={`${styles.gaugeTagWrapper} ${className}`}>
            <Gauge
                className={styles.gauge}
                sweep={250}
                strokeWidth={strokeWidth}
                value={value}
                min={min}
                max={max}
            />
            <div className={styles.measurementWrapper}>
                <div className={styles.name}>{name}</div>
                <div className={styles.value}>{value.toFixed(2)}</div>
                <div className={styles.units}>{units}</div>
            </div>
        </article>
    );
};
