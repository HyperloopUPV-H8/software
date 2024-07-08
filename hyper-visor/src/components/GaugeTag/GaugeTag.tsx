import styles from "components/GaugeTag/GaugeTag.module.scss";
import { Gauge } from "components/GaugeTag/Gauge/Gauge";
import { NumericMeasurementInfo, useGlobalTicker } from "common";
import { TextData } from "./TextData/TextData";
import { useState } from "react";

type Props = {
    measurement: NumericMeasurementInfo;
    className: string;
    strokeWidth: number;
    min: number;
    max: number;
};
export const GaugeTag = ({
    measurement,
    className,
    strokeWidth,
    min,
    max,
}: Props) => {

    const [value, setValue] = useState(0);

    useGlobalTicker(() => setValue(measurement.getUpdate()))

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
            <TextData
                name={measurement.name}
                units={measurement.units}
                value={value}
            ></TextData>
        </article>
    );
};
