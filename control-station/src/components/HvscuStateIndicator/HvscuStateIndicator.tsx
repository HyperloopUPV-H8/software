import { useGlobalTicker, useMeasurementsStore } from 'common';
import styles from './HvscuStateIndicator.module.scss';
import { getStateFromEnum, stateToColor } from 'state';
import { memo, useContext, useState } from 'react';
import { LostConnectionContext } from 'services/connections';

interface Props {
    measurementId: string;
    icon: string;
}

export const HvscuStateIndicator = memo(({ measurementId, icon }: Props) => {
    const getValue = useMeasurementsStore(
        (state) => state.getEnumMeasurementInfo(measurementId).getUpdate
    );

    const lostConnection = useContext(LostConnectionContext);

    const [variant, setVariant] = useState(getValue());
    const state = lostConnection
        ? 'fault'
        : getStateFromEnum(measurementId, variant);

    useGlobalTicker(() => {
        setVariant(getValue());
    });

    return (
        <div
            className={styles.state_indicator}
            style={{ backgroundColor: stateToColor[state] }}
        >
            <img className={styles.icon} src={icon} />

            <p className={styles.title}>
                {lostConnection ? 'DISCONNECTED' : state}
            </p>

            <img className={styles.icon} src={icon} />
        </div>
    );
});
