import styles from "components/GaugeTag/GaugeTag.module.scss";
import { Gauge } from "components/GaugeTag/Gauge/Gauge";
import { TextData } from "./TextData/TextData";
import { memo, useState } from "react";
import { useGlobalTicker } from "common";

type Props = {
    name: string;
    units: string;
    getUpdate: () => number;
    strokeWidth: number;
    min: number;
    max: number;
};
export const GaugeTag = memo(({
    name,
    units,
    getUpdate,
    strokeWidth,
    min,
    max,
}: Props) => {

    const [value, setValue] = useState(getUpdate());

    useGlobalTicker(() => {
        setValue(getUpdate());
    })

    return (
        <article className={styles.gaugeTagWrapper}>
            <Gauge
                className={styles.gauge}
                sweep={250}
                strokeWidth={strokeWidth}
                value={value}
                min={min}
                max={max}
            />
            <TextData
                name={name}
                units={units}
                value={value}
            ></TextData>
        </article>
    );
});
