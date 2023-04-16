import { Measurement } from "models/PodData/Measurement";
import { MeasurementRow } from "./MeasurementRow/MeasurementRow";
import styles from "./MeasurementRows.module.scss";

type Props = {
    measurements: Record<string, Measurement>;
};

export const MeasurementRows = ({ measurements }: Props) => {
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
