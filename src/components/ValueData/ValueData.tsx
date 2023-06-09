import styles from "components/ValueData/ValueData.module.scss";
import { Measurement, isNumericMeasurement } from "common";
import { useTextUpdater } from "services/ImperativeUpdater/useTextUpdater";
import { memo } from "react";
type Props = {
    measurement: Measurement;
};

export const ValueData = memo(({ measurement }: Props) => {
    const ref = useTextUpdater(measurement.id);

    const isNumeric = isNumericMeasurement(measurement);

    return (
        <div className={styles.valueDataWrapper}>
            <span className={styles.name}>{measurement.name}</span>
            {isNumeric && (
                <>
                    <span
                        ref={ref}
                        className={styles.value}
                    ></span>
                    <span className={styles.units}>{measurement.units}</span>
                </>
            )}
            {!isNumeric && (
                <span
                    ref={ref}
                    className={styles.value}
                ></span>
            )}
        </div>
    );
});
