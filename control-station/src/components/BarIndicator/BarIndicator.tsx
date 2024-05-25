import { NumericMeasurement, useMeasurementsStore } from "common";
import styles from "./BarIndicator.module.scss";
import { getPercentFromRange, getState, stateToColor, stateToColorBackground } from "state";

interface Props {
    icon?: string;
    title: string;
    measurement: NumericMeasurement;
}

export const BarIndicator = ({icon, title, measurement}: Props) => {

    measurement.value.last = 30;
    const state = getState(measurement);
    const percentage = getPercentFromRange(measurement.value.last, measurement.safeRange[0]!!, measurement.safeRange[1]!!)
    
    return (
        <div 
            className={styles.background}
            style={{backgroundColor: stateToColorBackground[state]}}
        >
            <div 
                className={styles.bar}
                style={{width: percentage + "%", backgroundColor: stateToColor[state]}}
            ></div>

            <div className={styles.infoContainer}>
                <div>
                    <div className={styles.icon}>{icon}</div>
                    <div className={styles.title}>{title}</div>
                </div>
                <div>
                    <div className={styles.value}>{measurement.value.last}</div>
                    <div className={styles.unit}>{measurement.units}</div>
                </div>
            </div>
        </div>
    )
}
