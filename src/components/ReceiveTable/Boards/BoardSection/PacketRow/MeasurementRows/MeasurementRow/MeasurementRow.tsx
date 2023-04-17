import { Measurement } from "models/PodData/Measurement";
import styles from "./MeasurementRow.module.scss";
import { isNumericType } from "adapters/GolangTypes";
type Props = {
    measurement: Measurement;
};

export const MeasurementRow = ({ measurement }: Props) => {
    const isNumeric = isNumericType(measurement.type);

    return (
        <div className={styles.measurementRow}>
            <div>{measurement.name}</div>
            {isNumeric && (
                <div className={styles.value}>
                    {(measurement.value as number).toFixed(3)}
                </div>
            )}
            {!isNumeric && (
                <div className={styles.value}>{measurement.value}</div>
            )}
            <div className={styles.units}>{measurement.units}</div>
        </div>
    );
};
