import { VcuMeasurements, useGlobalTicker, useMeasurementsStore } from "common";
import { useContext, useState } from "react";
import { LostConnectionContext } from "services/connections";
import styles from '../Data1Page.module.scss';
import hand from 'assets/svg/hand.svg'

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
            <div>
                <img src={hand} alt="hand" style={{ height: '1em', marginRight: '0.3em', flexShrink: 0 }} />
            </div>
            <div style={{color: textColor}}>
                Brake State
            </div>
        </div>
    );
}