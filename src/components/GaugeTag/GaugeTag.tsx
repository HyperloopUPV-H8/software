import styles from "components/GaugeTag/GaugeTag.module.scss";
import { Gauge } from "components/GaugeTag/Gauge/Gauge";

type Props = {
    className: string;
    strokeWidth: number;
    value: number;
    min: number;
    max: number;
};
export const GaugeTag = ({
    className,
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
                <div className={styles.name}>BatteryVoltage</div>
                <div className={styles.value}>{value.toFixed(2)}</div>
                <div className={styles.units}>Amp</div>
            </div>
        </article>
    );
};
