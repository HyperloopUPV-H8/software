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

    const [localLogChecked, setLocalLogChecked] = React.useState(true);

    const setLog = (log: boolean) => {
        if (typeof measurement.value === 'object' && measurement.value !== null && 'log' in measurement.value) {
            (measurement.value as any).log = log;
        } else {
            setLocalLogChecked(log);
        }
        useMeasurementsStore.setState({ measurements: { ...useMeasurementsStore.getState().measurements } });
    };

    const logChecked =
        typeof measurement.value === 'object' && measurement.value !== null && 'log' in measurement.value
            ? (measurement.value as any).log !== false
            : localLogChecked; 

    React.useEffect(() => {
        const handler = (e: any) => {
            setLog(e.detail);
        };
        window.addEventListener('log-all', handler);
        return () => window.removeEventListener('log-all', handler);
    }, [setLog]);

    return (
        <>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
                <input
                    type="checkbox"
                    className={styles.log_variable}
                    title="Log this variable"
                    style={{ accentColor: 'green', flexShrink: 0 }}
                    checked={logChecked}
                    onChange={e => setLog(e.currentTarget.checked)}
                />
                <span className={styles.name} style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', minWidth: 0 }}>
                    {measurement.name}
                </span>
            </span>
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
