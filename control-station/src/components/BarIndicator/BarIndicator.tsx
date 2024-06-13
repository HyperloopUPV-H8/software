import { useGlobalTicker } from "common";
import styles from "./BarIndicator.module.scss";
import {
    getPercentageFromRange,
    getStateFromRange,
    State,
    stateToColor,
    stateToColorBackground,
} from "state";
import { memo, useEffect, useRef, useState } from "react";

interface Props {
    icon?: string;
    title: string;
    getValue: () => number;
    safeRangeMin: number;
    safeRangeMax: number;
    units?: string;
}

export const BarIndicator = memo(({ icon, title, getValue, safeRangeMin, safeRangeMax, units }: Props) => {
    const [valueState, setValueState] = useState<number>(0);
    const percentage = useRef<number>(0);
    const state = useRef<State>(getStateFromRange(valueState, safeRangeMin, safeRangeMax));

    useGlobalTicker(() => {
        setValueState(getValue());
    })

    useEffect(() => {
        percentage.current = getPercentageFromRange(
            valueState,
            safeRangeMin,
            safeRangeMax
        )
        state.current = (getStateFromRange(valueState, safeRangeMin, safeRangeMax));
    })

    return (
        <div className={styles.container}>
            <div
                className={styles.background}
                style={{ backgroundColor: stateToColorBackground[state.current] }}
            ></div>
            
            <div
                className={styles.bar}
                style={{
                    width: percentage.current + "%",
                    backgroundColor: stateToColor[state.current],
                }}
            ></div>

            <div className={styles.infoContainer}>
                <div className={styles.iconName}>
                    <div className={styles.icon}>
                        <img src={icon} alt="" />
                    </div>
                    <div className={styles.title}>{title}</div>
                </div>
                    <div className={styles.valueUnits}>
                        <div className={styles.value}>{valueState?.toFixed(1)}</div>
                        <div className={styles.unit}>{units}</div>
                    </div>
            </div>
        </div>
    );
});
