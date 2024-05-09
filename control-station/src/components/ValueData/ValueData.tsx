import styles from "components/ValueData/ValueData.module.scss";
import { Measurement, isNumericMeasurement, useMeasurementsStore } from "common";
import { useTextUpdater } from "services/ImperativeUpdater/useTextUpdater";
import { memo } from "react";

type Props = {
    measurement: Measurement;
};

export const ValueData = memo(({ measurement }: Props) => {

    const measurements = useMeasurementsStore(state => state.measurements);

    const ref = useTextUpdater(() => {
        const storeMeas =
            measurements[measurement.id];

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
                        // ref={ref}
                        className={styles.value}
                    >
                        {measurement.value.average.toFixed(3)}
                    </span>
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
