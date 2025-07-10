import { VcuMeasurements, useGlobalTicker, useMeasurementsStore } from "common";
import { useContext, useState } from "react";
import { LostConnectionContext } from "services/connections";
import styles from '../MainPage.module.scss';

export const BrakeState = () => {
    const getValue = useMeasurementsStore(
            (state) => state.getBooleanMeasurementInfo(VcuMeasurements.allReeds).getUpdate
        );
    
        const lostConnection = useContext(LostConnectionContext);
    
        const [ReedsState, setVariant] = useState(getValue());
    
        useGlobalTicker(() => {
            setVariant(getValue());
        });

    return (
        <div className={styles.break_state} style={{ backgroundColor: lostConnection ? '#cccccc' : ReedsState ? '#99ccff' : '#f3785c' }}>
            <div style={{ color: lostConnection ? '#888888' : ReedsState ? '#0059b3' : '#571500' }}>
                {lostConnection ? 'DISCONNECTED' : ReedsState ? 'BRAKED' : 'UNBRAKED'}
            </div>
        </div>
    );
}