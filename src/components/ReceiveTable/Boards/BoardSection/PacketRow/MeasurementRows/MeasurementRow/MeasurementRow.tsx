import { Measurement, isNumericMeasurement } from "models/PodData/Measurement";
import styles from "./MeasurementRow.module.scss";
import { isNumericType } from "GolangTypes";
type Props = {
    measurement: Measurement;
};

export const MeasurementRow = ({ measurement }: Props) => {
    return (
        <div className={styles.measurementRow}>
            <div>{measurement.name}</div>
            {isNumericMeasurement(measurement) && (
                <>
                    <div className={styles.value}>
                        {measurement.value.average.toFixed(3)}
                    </div>
                    <div className={styles.units}>{measurement.units}</div>
                </>
            )}
            {!isNumericMeasurement(measurement) && (
                <div className={styles.value}>{measurement.value}</div>
            )}
        </div>
    );
};
