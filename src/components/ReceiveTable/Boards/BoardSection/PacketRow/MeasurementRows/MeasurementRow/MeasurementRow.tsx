import { Measurement } from "models/PodData/Measurement";
import styles from "./MeasurementRow.module.scss";
type Props = {
    measurement: Measurement;
};

export const MeasurementRow = ({ measurement }: Props) => {
    return (
        <div className={styles.wrapper}>
            <div>{measurement.name}</div>
            <div className={styles.value}>{measurement.value}</div>
            <div className={styles.units}>{measurement.units}</div>
        </div>
    );
};
