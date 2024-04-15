import styles from './MeasurementView.module.scss';
import {
    Measurement,
    isNumericMeasurement,
    useMeasurementsStore,
} from 'common';
import { useUpdater } from './useUpdater';
import { FormEvent } from 'react';

type Props = {
    measurement: Measurement;
};

export const MeasurementView = ({ measurement }: Props) => {
    const setShowMeasurementLatest = useMeasurementsStore(
        (state) => (showLatest: boolean) =>
            state.showMeasurementLatest(measurement.id, showLatest)
    );
    const isNumeric = isNumericMeasurement(measurement);

    const { valueRef } = useUpdater(
        measurement.id,
        isNumeric
            ? measurement.value.showLatest
                ? measurement.value.last.toFixed(3)
                : measurement.value.average.toFixed(3)
            : measurement.value.toString()
    );

    const onLatestValueChange = (event: FormEvent<HTMLInputElement>) => {
        setShowMeasurementLatest(event.currentTarget.checked);
    };

    return (
        <>
            <span className={styles.name}>{measurement.name}</span>
            {isNumeric && (
                <>
                    <input
                        type="checkbox"
                        defaultChecked={false}
                        className={styles.show_last}
                        title="Show latest value"
                        onInput={onLatestValueChange}
                    />
                    <span ref={valueRef} className={styles.value}></span>
                    <span className={styles.units}>{measurement.units}</span>
                    <span className={styles.type}>{measurement.type}</span>
                </>
            )}
            {!isNumeric && (
                <>
                    <span ref={valueRef} className={styles.value}></span>
                    <span className={styles.type}>{measurement.type}</span>
                </>
            )}
        </>
    );
};
