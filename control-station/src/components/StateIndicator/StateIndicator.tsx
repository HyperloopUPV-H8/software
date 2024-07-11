import { useGlobalTicker, useMeasurementsStore } from 'common';
import styles from './StateIndicator.module.scss';
import { getStateFromEnum, stateToColor } from 'state';
import { memo, useState } from 'react';

interface Props {
    measurementId: string;
    icon: string;
}

export const StateIndicator = memo(({ measurementId, icon }: Props) => {
    const getValue = useMeasurementsStore(
        (state) => state.getEnumMeasurementInfo(measurementId).getUpdate
    );

    const [variant, setVariant] = useState(getValue());
    const state = getStateFromEnum(measurementId, variant);

    useGlobalTicker(() => {
        setVariant(getValue());
    });

    return (
        <div
            className={styles.state_indicator}
            style={{ backgroundColor: stateToColor[state] }}
        >
            <img className={styles.icon} src={icon} alt="State icon" />

            <p className={styles.title}>{variant}</p>

            <img className={styles.icon} src={icon} alt="State icon" />
        </div>
    );
});
