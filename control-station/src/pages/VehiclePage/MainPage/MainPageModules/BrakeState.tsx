import { VcuMeasurements, useGlobalTicker, useMeasurementsStore } from "common";
import { useContext, useState } from "react";
import { LostConnectionContext } from "services/connections";
import styles from '../MainPage.module.scss';

export const BrakeState = () => {
    const getBooleanMeasurementInfo = useMeasurementsStore((state) => state.getBooleanMeasurementInfo);
    const lostConnection = useContext(LostConnectionContext);
    const Reeds = getBooleanMeasurementInfo(
        VcuMeasurements.allReeds
    );

    const [ReedsState, setValueState] = useState(false);
    useGlobalTicker(() => {
        setValueState(Reeds.getUpdate());
    });



    const bgColor = lostConnection
        ? '#cccccc'
        : ReedsState
            ? '#99ccff'
            : '#F3785C';
    const textColor = lostConnection
        ? '#888888'
        : ReedsState
            ? '#0059b3'
            : '#571500';

    return (
        <div className={styles.break_state} style={{backgroundColor: bgColor}}>
            <div style={{color: textColor}}>
                {lostConnection ? 'Connection Lost' : ReedsState ? 'UNBRAKED' : 'BRAKED'}
            </div>
        </div>
    );
}