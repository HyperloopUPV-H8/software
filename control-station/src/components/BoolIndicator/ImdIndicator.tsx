import { HvscuMeasurements, useGlobalTicker, useMeasurementsStore, usePodDataStore, getPacket } from 'common';
import styles from './BoolIndicator.module.scss';
import thunderIcon from 'assets/svg/thunder-filled.svg'
import { useContext, useState, useRef, useMemo } from 'react';
import { LostConnectionContext } from 'services/connections';

export const ImdIndicator = () => {
    const getValue = useMeasurementsStore(
        (state) => state.getBooleanMeasurementInfo(HvscuMeasurements.IsImdOk).getUpdate
    );

    const podData = usePodDataStore((state) => state.podData);
    const lostConnection = useContext(LostConnectionContext);

    const [hasReceivedData, setHasReceivedData] = useState(false);
    const [IsImdOk, setVariant] = useState<boolean | null>(true);
    
    // Delta tracking state
    const deltaTrackingRef = useRef<{
        value: boolean | null;
        lastSampleTime: number;
        lastChangeTime: number;
        displayValue: boolean | null;
        isStale: boolean;
    } | null>(null);

    // Create delta-tracked getter with memoization
    const getDeltaTrackedValue = useMemo(() => {
        return () => {
            const now = Date.now();
            const prevData = deltaTrackingRef.current;
            
            // Check if 400ms have passed since last sample
            if (prevData && now - prevData.lastSampleTime < 400) {
                // Not enough time passed, return current value if not stale, otherwise null
                const currentValue = getValue();
                return prevData.isStale ? null : currentValue;
            }
            
            // 400ms have passed or no previous data, get fresh value
            const currentValue = getValue();
            
            // Initialize if no previous data
            if (!prevData) {
                deltaTrackingRef.current = {
                    value: currentValue,
                    lastSampleTime: now,
                    lastChangeTime: now,
                    displayValue: currentValue,
                    isStale: false,
                };
                return currentValue;
            }
            
            // Check for delta
            const hasChanged = prevData.value !== currentValue;
            
            if (hasChanged) {
                // Value changed, update everything
                deltaTrackingRef.current = {
                    value: currentValue,
                    lastSampleTime: now,
                    lastChangeTime: now,
                    displayValue: currentValue,
                    isStale: false,
                };
                return currentValue;
            } else {
                // Value hasn't changed, check if it's been stale for too long
                const staleDuration = now - prevData.lastChangeTime;
                const isStale = staleDuration > 100; // 100ms grace period
                
                deltaTrackingRef.current = {
                    value: currentValue,
                    lastSampleTime: now,
                    lastChangeTime: prevData.lastChangeTime,
                    displayValue: isStale ? null : currentValue,
                    isStale: isStale,
                };
                return isStale ? null : currentValue;
            }
        };
    }, [getValue]);

    useGlobalTicker(() => {
        const hvscuBoard = podData.boards.find(board => board.name === 'HVSCU');
        const hasReceivedPackets = hvscuBoard?.packets.some(packet => packet.count > 0) || false;
        
        const currentValue = getDeltaTrackedValue();
        setVariant(currentValue);
        
        if (hasReceivedPackets && !hasReceivedData) {
            setHasReceivedData(true);
        }
    });

    const showDisconnected = lostConnection || !hasReceivedData || IsImdOk === null;

    return (
        <div
            className={styles.state_indicator}
            style={{ backgroundColor: showDisconnected ? '#cccccc' : IsImdOk ? '#ACF293' : '#EF9A87' }}
        >
            <img className={styles.icon} src={thunderIcon} />

            <p className={styles.title}>
                {showDisconnected ? 'DISCONNECTED' : IsImdOk ? 'ISOLATED' : 'ISOLATION FAULT'}
            </p>

            <img className={styles.icon} src={thunderIcon} />
        </div>
    );
};