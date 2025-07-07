import { HvscuMeasurements, useGlobalTicker, useMeasurementsStore } from 'common';
import styles from './HvscuStateIndicator.module.scss';
import thunderIcon from 'assets/svg/thunder-filled.svg'
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
            style={{ backgroundColor: lostConnection ? '#cccccc' : IsImdOk ? '#ACF293' : '#FB3B3B' }}
        >
            <img className={styles.icon} src={thunderIcon} />

            <p className={styles.title}>
                {lostConnection ? 'DISCONNECTED' : IsImdOk ? 'ISOLATED' : 'SHORT CIRCUIT'}
            </p>

            <img className={styles.icon} src={thunderIcon} />
        </div>
    );
};