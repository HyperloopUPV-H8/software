import { useGlobalTicker, useMeasurementsStore } from 'common';
import styles from './EnumIndicator.module.scss';
import { memo, useContext, useState } from 'react';
import { LostConnectionContext } from 'services/connections';

interface Props {
    measurementId: string;
    icon: string;
}

export const EnumIndicator = memo(({ measurementId, icon }: Props) => {
    const getValue = useMeasurementsStore(
        (state) => state.getEnumMeasurementInfo(measurementId).getUpdate
    );

    const lostConnection = useContext(LostConnectionContext);

    const [variant, setVariant] = useState(getValue());
    const state = lostConnection
        ? 'DISCONNECTED'
        : variant;

    useGlobalTicker(() => {
        setVariant(getValue());
    });

    return (
        <div
            className={styles.enum_indicator}
            style={{ backgroundColor: enumToColor[state.toUpperCase()] || enumToColor.default }}
        >
            <img className={styles.icon} src={icon} />

            <p className={styles.title}>
                {lostConnection ? 'DISCONNECTED' : state}
            </p>

            <img className={styles.icon} src={icon} />
        </div>
    );
});

const enumToColor: { [key: string]: string } = {
    'DISCONNECTED' : '#cccccc',

    'NOT_CHARGING' : '#EBF6FF',
    'CHARGING' : '#F28E31',

    'OPEN' : '#ACF293',
    'PRECHARGE' : '#F4F788',
    'CLOSED' : '#F28E31',
    'CLOSE' : '#F28E31',

    'DISENGAGED' : '#EF9A87',
    'ENGAGED' : '#ACF293',

    default : '#EBF6FF'

}
