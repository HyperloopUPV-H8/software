import styles from "components/ValueData/ValueData.module.scss";
import { Measurement, isNumericMeasurement } from "common";
import { useTextUpdater } from "services/ImperativeUpdater/useTextUpdater";
import { memo } from "react";
import { store } from "store";

type Props = {
    measurement: Measurement;
};

export const ValueData = memo(({ measurement }: Props) => {
    const ref = useTextUpdater(() => {
        const storeMeas =
            store.getState().measurements.measurements[measurement.id];

        if (!storeMeas) {
            return "Default";
        }

        if (isNumericMeasurement(storeMeas)) {
            return storeMeas.value.average.toFixed(3);
        } else {
            return storeMeas.value.toString();
        }
    });

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
