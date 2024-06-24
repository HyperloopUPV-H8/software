import {
    EnumMeasurement,
    getEnumMeasurement,
    NumericMeasurement,
    useGlobalTicker,
    useMeasurementsStore,
} from 'common';
import styles from './StateIndicator.module.scss';
import { getStateFromEnum, State, stateToColorBackground } from 'state';
import { memo, useEffect, useRef, useState } from 'react';

interface Props {
    measurementId: string;
    icon?: string;
}

export const StateIndicator = memo(({ measurementId, icon }: Props) => {
    const measurement = useMeasurementsStore((state) =>
        state.getEnumMeasurementInfo(measurementId)
    );

    const [state, setState] = useState(measurement.getUpdate());

    useGlobalTicker(() => {
        setState(measurement.getUpdate());
    });

    return (
        <div
            className={styles.wrapper}
            style={{ backgroundColor: stateToColorBackground['stable'] }}
        >
            <div className={styles.icon}>
                <img src={icon} alt="State icon" />
            </div>

            <p className={styles.title}>{state}</p>

            <div className={styles.icon}>
                <img src={icon} alt="State icon" />
            </div>
        </div>
    );
});
