import { useGlobalTicker } from 'common';
import styles from './OrientationIndicator.module.scss';
import { memo, useContext, useState, useRef, useMemo } from 'react';
import { LostConnectionContext } from 'services/connections';

interface Props {
    icon?: string;
    name: string;
    getValue: () => number;
    units?: string;
    color?: string;
    backgroundColor?: string;
    className?: string;
}

export const OrientationIndicator = memo(
    ({
        icon,
        name,
        getValue,
        units,
        className,
    }: Props) => {
        const [valueState, setValueState] = useState<number | null>(0);
        const lostConnection = useContext(LostConnectionContext);
        
        // Delta tracking state
        const deltaTrackingRef = useRef<{
            value: number | null;
            lastSampleTime: number;
            lastChangeTime: number;
            displayValue: number | null;
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
                
                // Check for delta with tolerance
                const prevValue = prevData.value;
                const tolerance = 0.01; // Small tolerance for orientation values
                const hasChanged = prevValue === null || currentValue === null 
                    ? prevValue !== currentValue 
                    : Math.abs(prevValue - currentValue) > tolerance;
                
                if (hasChanged) {
                    // Value changed significantly, update everything
                    deltaTrackingRef.current = {
                        value: currentValue,
                        lastSampleTime: now,
                        lastChangeTime: now,
                        displayValue: currentValue,
                        isStale: false,
                    };
                    return currentValue;
                } else {
                    // Value hasn't changed significantly, check if it's been stale for too long
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
            const value = getDeltaTrackedValue();
            setValueState(value);
        });

        return (
            <div
                className={`${styles.bar_indicator} ${className}`}
            >
                <div className={styles.name_display}>
                    <img className={styles.icon} src={icon} />
                    <p className={styles.name}>{name}</p>
                </div>
                <div className={styles.value_display}>
                    <p className={styles.value}>
                        {lostConnection || valueState === null ? '-.--' : valueState.toFixed(2)}
                    </p>
                    <p className={styles.units}>{units}</p>
                </div>
            </div>
        );
    }
);
