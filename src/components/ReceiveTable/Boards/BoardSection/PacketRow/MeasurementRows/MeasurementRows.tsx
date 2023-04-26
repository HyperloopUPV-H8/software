import styles from "./MeasurementRows.module.scss";
import { Measurement } from "common";
import { MeasurementRow } from "./MeasurementRow/MeasurementRow";

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
