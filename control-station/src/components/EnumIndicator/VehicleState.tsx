import { useGlobalTicker, useMeasurementsStore, VcuMeasurements } from 'common';
import styles from './EnumIndicator.module.scss';
import { useContext, useState } from 'react';
import { LostConnectionContext } from 'services/connections';
import teamLogo from 'assets/svg/team_logo.svg'

export const VehicleState = () => {
    const generalStateMeasurement = useMeasurementsStore(
        (state) => state.getEnumMeasurementInfo(VcuMeasurements.generalState).getUpdate
    );
    const operationalStateMeasurement = useMeasurementsStore(
        (state) => state.getEnumMeasurementInfo(VcuMeasurements.operationalState).getUpdate
    );

    const lostConnection = useContext(LostConnectionContext);

    const [generalState, setGeneralState] = useState(generalStateMeasurement);
    const [operationalState, setOperationalState] = useState(operationalStateMeasurement);
    const state = lostConnection
        ? 'DISCONNECTED'
        : (generalState == 'OPERATIONAL') ? operationalState : generalState;

    useGlobalTicker(() => {
        setGeneralState(generalStateMeasurement);
        setOperationalState(operationalStateMeasurement);
    });

    return (
        <div
            className={styles.enum_indicator}
            style={{ backgroundColor: enumToColor[state] || enumToColor.default }}
        >
            <img className={styles.icon} src={teamLogo} />

            <p className={styles.title}>
                {enumToText[state] ?? state}
            </p>

            <img className={styles.icon} src={teamLogo} />
        </div>
    );
}

const enumToColor: { [key: string]: string } = {
    'DISCONNECTED' : '#cccccc',
    "FAULT" : '#EF9A87',
    "END_OF_RUN" : '#9BF37C',
    "ENERGIZED" : '#9BF37C',
    "READY" : '#9BF37C',
    "DEMONSTRATION" : '#9BF37C',
    default : '#EBF6FF'

}

const enumToText: { [key:string]: string } = {
    'FAULT' : 'EMERGENCY',
    "END_OF_RUN" : 'END OF RUN'
}
