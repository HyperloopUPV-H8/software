import { NumericMeasurement } from "common";
import styles from "./CoilInfoLabel.module.scss";

type Props = {
    measurement: NumericMeasurement;
};

export const CoilInfoLabel = ({ measurement }: Props) => {
    return (
        <div className={styles.coilInfoLabelWrapper}>
            <span className={styles.name}>{measurement.name}</span>
            <span className={styles.value}>
                {measurement.value.average.toFixed(2) + " " + measurement.units}
            </span>
        </div>
    );
};
