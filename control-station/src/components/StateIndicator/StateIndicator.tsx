import { EnumMeasurement } from "common";
import styles from "./StateIndicator.module.scss"
import { getState, stateToColorBackground } from "state";

interface Props {
    measurement: EnumMeasurement;
    icon?: string;
}

export const StateIndicator = ({measurement, icon}: Props) => {
    const state = getState(measurement);

    return (
        <div className={styles.wrapper}
            style={{backgroundColor: stateToColorBackground[state]}}
        >
            <div className={styles.icon}>
                <img src={icon} alt="State icno" />
            </div>

                <div className={styles.title}>{measurement.value}</div>
                
            <div className={styles.icon}>
                <img src={icon} alt="State icno" />
            </div>
        </div>
    )
}
