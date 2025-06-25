import React from 'react';
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

    const setLog = (log: boolean) => {
        if (isNumeric && typeof measurement.value === 'object') {
            (measurement.value as any).log = log;
            useMeasurementsStore.setState({ measurements: { ...useMeasurementsStore.getState().measurements } });
        }
    };

    const logChecked = isNumeric && typeof measurement.value === 'object' // Checked by default
        ? (measurement.value as any).log !== false
        : false;

    React.useEffect(() => {
        const handler = (e: any) => {
            setLog(e.detail);
        };
        window.addEventListener('log-all', handler);
        return () => window.removeEventListener('log-all', handler);
    }, [setLog]);

    return (
        <>
            <span className={styles.name}>{measurement.name}</span>
            {isNumeric && (
                <>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <input
                        type="checkbox"
                        defaultChecked={false}
                        className={styles.show_last}
                        title="Show latest value"
                        onInput={onLatestValueChange}
                    />
                    <input
                        type="checkbox"
                        className={styles.log_variable}
                        title="Log this variable"
                        style={{ accentColor: 'green'}}
                        checked={logChecked}
                        onChange={e => setLog(e.currentTarget.checked)}
                    />
                    </span>
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
