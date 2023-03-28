import { Measurement } from "models/PodData/Measurement";
import { MeasurementRow } from "./MeasurementRow/MeasurementRow";
import styles from "./MeasurementRows.module.scss";

export const MeasurementRows = ({
    measurements,
}: {
    measurements: Record<string, Measurement>;
}) => {
    return (
        <div className={styles.measurementRowsWrapper}>
            {Object.values(measurements).map((measurement) => {
                return (
                    <MeasurementRow
                        key={measurement.name}
                        measurement={measurement}
                    ></MeasurementRow>
                );
            })}
        </div>
    );
};
