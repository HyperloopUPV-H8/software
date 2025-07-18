import {
  HvscuMeasurements,
  useGlobalTicker,
  useMeasurementsStore,
} from "common";
import { memo, useContext, useState, useRef, useMemo, useEffect } from "react";
import { LostConnectionContext } from "services/connections";
import { DELTA_SAMPLE_PERIOD, DELTA_GRACE_PERIOD } from "constants/deltaTracking";
import styles from "../MainPage.module.scss";

type Props = {
  measurement: string;
};

export const LEDS = memo(({ measurement }: Props) => {
  const getNumericMeasurementInfo = useMeasurementsStore(
    (state) => state.getNumericMeasurementInfo,
  );
  const lostConnection = useContext(LostConnectionContext);
  const voltage = getNumericMeasurementInfo(measurement);

  const [VoltageValue, setValueState] = useState<number | null>(0);

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

      // Check if sample period has passed since last sample
      if (prevData && now - prevData.lastSampleTime < DELTA_SAMPLE_PERIOD) {
        // Not enough time passed, return current value if not stale, otherwise null
        const currentValue = voltage.getUpdate();
        return prevData.isStale ? null : currentValue;
      }

      // Sample period has passed or no previous data, get fresh value
      const currentValue = voltage.getUpdate();

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
      const tolerance = 0.5; // 0.5V tolerance for voltage changes
      const hasChanged =
        prevValue === null || currentValue === null
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
        const isStale = staleDuration > DELTA_GRACE_PERIOD; // Grace period for voltage values

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
  }, [voltage.getUpdate]);

  useGlobalTicker(() => {
    const value = getDeltaTrackedValue();
    setValueState(value);
  });

  const [blink, setBlink] = useState(true);
  useEffect(() => {
    if (lostConnection) return;
    const interval = setInterval(() => {
      setBlink((b) => !b);
    }, 500);
    return () => clearInterval(interval);
  }, [lostConnection]);

  const isStale = VoltageValue === null;
  const bgColor =
    lostConnection || isStale
      ? "#cccccc"
      : (VoltageValue || 0) < 60
        ? "#9BF37C"
        : blink
          ? "red"
          : "white";

  return <div className={styles.leds} style={{ backgroundColor: bgColor }} />;
});
