import { useGlobalTicker, useMeasurementsStore, VcuMeasurements, usePodDataStore } from 'common';
import styles from './EnumIndicator.module.scss';
import { useContext, useState, useRef, useMemo } from 'react';
import { LostConnectionContext } from 'services/connections';
import teamLogo from 'assets/svg/team_logo.svg'

export const VehicleState = () => {
    const generalStateMeasurement = useMeasurementsStore(
        (state) => state.getEnumMeasurementInfo(VcuMeasurements.generalState).getUpdate
    );
    const operationalStateMeasurement = useMeasurementsStore(
        (state) => state.getEnumMeasurementInfo(VcuMeasurements.operationalState).getUpdate
    );

    const podData = usePodDataStore((state) => state.podData);
    const lostConnection = useContext(LostConnectionContext);

    const [hasReceivedData, setHasReceivedData] = useState(false);
    const [generalState, setGeneralState] = useState<string | null>('FAULT');
    const [operationalState, setOperationalState] = useState<string | null>('FAULT');
    
    // Delta tracking state for both states
    const deltaTrackingRef = useRef<{
        generalValue: string | null;
        operationalValue: string | null;
        lastSampleTime: number;
        lastChangeTime: number;
        isStale: boolean;
    } | null>(null);

    // Create delta-tracked getter with memoization
    const getDeltaTrackedValues = useMemo(() => {
        return () => {
            const now = Date.now();
            const prevData = deltaTrackingRef.current;
            
            // Check if 400ms have passed since last sample
            if (prevData && now - prevData.lastSampleTime < 400) {
                // Not enough time passed, return current values if not stale, otherwise null
                const currentGeneral = generalStateMeasurement();
                const currentOperational = operationalStateMeasurement();
                return prevData.isStale 
                    ? { general: null, operational: null }
                    : { general: currentGeneral, operational: currentOperational };
            }
            
            // 400ms have passed or no previous data, get fresh values
            const currentGeneral = generalStateMeasurement();
            const currentOperational = operationalStateMeasurement();
            
            // Initialize if no previous data
            if (!prevData) {
                deltaTrackingRef.current = {
                    generalValue: currentGeneral,
                    operationalValue: currentOperational,
                    lastSampleTime: now,
                    lastChangeTime: now,
                    isStale: false,
                };
                return { general: currentGeneral, operational: currentOperational };
            }
            
            // Check for delta (either state changing means there's a change)
            const hasChanged = prevData.generalValue !== currentGeneral || 
                             prevData.operationalValue !== currentOperational;
            
            if (hasChanged) {
                // Value changed, update everything
                deltaTrackingRef.current = {
                    generalValue: currentGeneral,
                    operationalValue: currentOperational,
                    lastSampleTime: now,
                    lastChangeTime: now,
                    isStale: false,
                };
                return { general: currentGeneral, operational: currentOperational };
            } else {
                // Values haven't changed, check if it's been stale for too long
                const staleDuration = now - prevData.lastChangeTime;
                const isStale = staleDuration > 100; // 100ms grace period
                
                deltaTrackingRef.current = {
                    generalValue: currentGeneral,
                    operationalValue: currentOperational,
                    lastSampleTime: now,
                    lastChangeTime: prevData.lastChangeTime,
                    isStale: isStale,
                };
                return isStale 
                    ? { general: null, operational: null }
                    : { general: currentGeneral, operational: currentOperational };
            }
        };
    }, [generalStateMeasurement, operationalStateMeasurement]);

    useGlobalTicker(() => {
        const vcuBoard = podData.boards.find(board => board.name === 'VCU');
        const hasReceivedPackets = vcuBoard?.packets.some(packet => packet.count > 0) || false;
        
        const values = getDeltaTrackedValues();
        setGeneralState(values.general);
        setOperationalState(values.operational);
        
        if (hasReceivedPackets && !hasReceivedData) {
            setHasReceivedData(true);
        }
    });

    const showDisconnected = lostConnection || !hasReceivedData || generalState === null || operationalState === null;
    
    const state = showDisconnected
        ? 'DISCONNECTED'
        : (generalState == 'OPERATIONAL') ? operationalState : generalState;

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
    "END_OF_RUN" : '#BB83F8',
    "ENERGIZED" : '#FBD15B',
    "READY" : '#B2CFD6',
    "DEMONSTRATION" : '#ACF293',
    default : '#EBF6FF'

}

const enumToText: { [key:string]: string } = {
    'FAULT' : 'EMERGENCY',
    "END_OF_RUN" : 'END OF RUN'
}
