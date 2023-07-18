import { useMemo } from "react";
import styles from "./RangeBar.module.scss";
import { clampAndNormalize } from "math";
import { getStateFromRange } from "state";
type Props = {
    type: "range" | "temp";
    value: number;
    min: number;
    max: number;
};

const colors = {
    stable: "hsl(96, 90%, 61%)",
    warning: "hsl(52, 90%, 61%)",
    fault: "hsl(356, 90%, 61%)",
};

export const RangeBar = ({ type, value, min, max }: Props) => {
    const percentage = clampAndNormalize(value, min, max) * 100;

    const color = colors[getStateFromRange(value, min, max)];
    const oppositeHeight = 100 - percentage;

    return (
        <div className={`${type == "temp" ? styles.tempWrapper : ""}`}>
            <div
                className={styles.rangeBarWrapper}
                style={{
                    backgroundColor: color,
                    borderColor: color,
                }}
            >
                <div
                    className={styles.content}
                    style={{
                        height: `${oppositeHeight}%`,
                    }}
                ></div>
            </div>
            {type == "temp" && (
                <div
                    className={styles.bulb}
                    style={{ backgroundColor: color }}
                ></div>
            )}
        </div>
    );
};
