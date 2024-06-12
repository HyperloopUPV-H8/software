import { EnumMeasurement, NumericMeasurement, useGlobalTicker, useMeasurementsStore } from "common";
import styles from "./StateIndicator.module.scss"
import { getState, State, stateToColorBackground } from "state";
import { memo, useRef, useState } from "react";

interface Props {
    measurementId: string;
    icon?: string;
}

export const StateIndicator = memo(({measurementId, icon}: Props) => {
    const getMeasurement = useMeasurementsStore(state => state.getMeasurement)
    let [measurement, setMeasurement] = useState<EnumMeasurement>(getMeasurement(measurementId) as EnumMeasurement)
    const state = useRef<State>(getState(measurement as EnumMeasurement))

    useGlobalTicker(() => {
        setMeasurement(getMeasurement(measurementId) as EnumMeasurement)
    })

    return (
        <div className={styles.wrapper}
            style={{backgroundColor: stateToColorBackground[state.current]}}
        >
            <div className={styles.icon}>
                <img src={icon} alt="State icon" />
            </div>

                <div className={styles.title}>
                    {/* {measurement.type} */}
                </div>
                
            <div className={styles.icon}>
                <img src={icon} alt="State icon" />
            </div>
        </div>
    )
})
