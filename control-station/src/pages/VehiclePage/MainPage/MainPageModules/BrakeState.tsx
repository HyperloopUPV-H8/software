import { VcuMeasurements, useGlobalTicker, useMeasurementsStore, usePodDataStore } from "common";
import { useContext, useState } from "react";
import { LostConnectionContext } from "services/connections";
import styles from '../MainPage.module.scss';

export const BrakeState = () => {
    const getValue = useMeasurementsStore(
            (state) => state.getBooleanMeasurementInfo(VcuMeasurements.allReeds).getUpdate
        );
    
    const podData = usePodDataStore((state) => state.podData);
    const lostConnection = useContext(LostConnectionContext);

    const [hasReceivedData, setHasReceivedData] = useState(false);
    const [ReedsState, setVariant] = useState(false);

    useGlobalTicker(() => {
        const vcuBoard = podData.boards.find(board => board.name === 'VCU');
        const hasReceivedPackets = vcuBoard?.packets.some(packet => packet.count > 0) || false;
        
        const currentValue = getValue();
        setVariant(currentValue);

        if (hasReceivedPackets && !hasReceivedData) {
            setHasReceivedData(true);
        }
    });

    const showDisconnected = lostConnection || !hasReceivedData;

    return (
        <div className={styles.break_state} style={{ backgroundColor: showDisconnected ? '#cccccc' : ReedsState ? '#f3785c' : '#99ccff' }}>
            <div style={{ color: showDisconnected ? '#888888' : ReedsState ? '#571500' : '#0059b3' }}>
                {showDisconnected ? 'DISCONNECTED' : ReedsState ? 'BRAKED' : 'UNBRAKED'}
            </div>
        </div>
    );
}