import styles from "./MeasurementView.module.scss";
import { Measurement, isNumericMeasurement } from "common";
import { useUpdater } from "./useUpdater";

type Props = {
    measurement: Measurement;
};

export const MeasurementView = ({ measurement }: Props) => {
    const isNumeric = isNumericMeasurement(measurement);

    const { valueRef } = useUpdater(
        measurement.id,
        isNumeric
            ? measurement.value.average.toFixed(3)
            : measurement.value.toString()
    );

    return (
        <>
            <span className={styles.name}>{measurement.name}</span>
            {isNumeric && (
                <>
                    <span
                        ref={valueRef}
                        className={styles.value}
                    ></span>
                    <span className={styles.units}>{measurement.units}</span>
                    <span className={styles.type}>{measurement.type}</span>
                </>
            )}
            {!isNumeric && (
                <>
                    <span
                        ref={valueRef}
                        className={styles.value}
                    ></span>
                    <span className={styles.type}>{measurement.type}</span>
                </>
            )}
        </>
    );
};
