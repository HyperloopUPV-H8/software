import { isNumericMeasurement, Measurement } from "common";
import styles from "./BarIndicator.module.scss";
import {
    getPercentageFromRange,
    getState,
    stateToColor,
    stateToColorBackground,
} from "state";
import { useEffect, useState } from "react";

interface Props {
    icon?: string;
    title: string;
    measurement: Measurement;
    units?: string;
}

export const BarIndicator = ({ icon, title, measurement, units }: Props) => {
    let [percentage, setPercentage] = useState<number>(0);
    let [value, setValue] = useState<number>(0);
    const state = getState(measurement);

    useEffect(() => {
        if (isNumericMeasurement(measurement)) {
            setPercentage(
                getPercentageFromRange(
                    measurement.value.last,
                    measurement.safeRange[0]!!,
                    measurement.safeRange[1]!!
                )
            );
            setValue(measurement.value.last);
        } else if (measurement.type == "enum") {
            setPercentage(Number(measurement.value));
            setValue(Number(measurement.value));
        }
    });

    return (
        <div className={styles.container}>
            <div
                className={styles.background}
                style={{ backgroundColor: stateToColorBackground[state] }}
            ></div>
            <div
                className={styles.bar}
                style={{
                    width: percentage + "%",
                    backgroundColor: stateToColor[state],
                }}
            ></div>

            <div className={styles.infoContainer}>
                <div className={styles.iconName}>
                    <div className={styles.icon}>
                        <img src={icon} alt="" />
                    </div>
                    <div className={styles.title}>{title}</div>
                </div>
                    {isNumericMeasurement(measurement) && (
                        <div className={styles.valueUnits}>
                            <div className={styles.value}>{value.toFixed(1)}</div>
                            <div className={styles.unit}>{units}</div>
                    </div>
                    )}
            </div>
        </div>
    );
};
