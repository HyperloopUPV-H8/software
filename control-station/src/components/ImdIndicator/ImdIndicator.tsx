import { HvscuMeasurements, useGlobalTicker, useMeasurementsStore } from 'common';
import styles from './ImdIndicator.module.scss';
import thunderIcon from 'assets/svg/thunder-filled.svg'
import { memo, useContext, useState } from 'react';
import { LostConnectionContext } from 'services/connections';

interface Props {
    measurementId: string;
    icon: string;
}

export const ImdIndicator = () => {
    const getValue = useMeasurementsStore(
        (state) => state.getBooleanMeasurementInfo(HvscuMeasurements.IsImdOk).getUpdate
    );

    const lostConnection = useContext(LostConnectionContext);

    const [IsImdOk, setVariant] = useState(getValue());

    useGlobalTicker(() => {
        setVariant(getValue());
    });

    return (
        <div
            className={styles.state_indicator}
            style={{ backgroundColor: lostConnection ? '#cccccc' : IsImdOk ? '#ACF293' : '#EF9A87' }}
        >
            <img className={styles.icon} src={thunderIcon} />

            <p className={styles.title}>
                {lostConnection ? 'DISCONNECTED' : IsImdOk ? 'ISOLATED' : 'ISOLATION FAULT'}
            </p>

            <img className={styles.icon} src={thunderIcon} />
        </div>
    );
};