import styles from "./CoilInfoLabels.module.scss";

import { CoilInfoLabel } from "./CoilInfoLabel/CoilInfoLabel";
import { NumericMeasurement } from "common";

type Props = {
    measurements: NumericMeasurement[];
};

export const CoilInfoLabels = ({ measurements }: Props) => {
    return (
        <div className={styles.coilInfoLabelsWrapper}>
            {measurements.map((measurement) => {
                return (
                    <CoilInfoLabel
                        key={measurement.name}
                        measurement={measurement}
                    />
                );
            })}
        </div>
    );
};
