import { EnumMeasurement, NumericMeasurement } from "common";
import styles from "./StateIndicator.module.scss"
import { getState, State, stateToColorBackground } from "state";
import { useState } from "react";

interface Props {
    measurement: EnumMeasurement;
    icon?: string;
}

export const StateIndicator = ({measurement, icon}: Props) => {
    const [state, setState] = useState<State>(getState(measurement));
    console.log(measurement.value)

    return (
        <div className={styles.wrapper}
            style={{backgroundColor: stateToColorBackground[state]}}
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
}
