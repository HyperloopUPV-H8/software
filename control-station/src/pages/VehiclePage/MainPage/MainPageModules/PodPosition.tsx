import { PcuMeasurements, useGlobalTicker, useMeasurementsStore } from "common";
import { useContext, useState, useRef, useMemo } from "react";
import { LostConnectionContext } from "services/connections";
import levion from "assets/svg/levion.svg";
import styles from "../MainPage.module.scss";
import { getPercentageFromRange } from "state";

export const PodPosition = () => {
  const getNumericMeasurementInfo = useMeasurementsStore(
    (state) => state.getNumericMeasurementInfo,
  );
  const lostConnection = useContext(LostConnectionContext);
  const position = getNumericMeasurementInfo(PcuMeasurements.podPosition);

  const [positionValue, setValueState] = useState<number | null>(0);

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
        const currentValue = position.getUpdate();
        return prevData.isStale ? null : currentValue;
      }

      // 400ms have passed or no previous data, get fresh value
      const currentValue = position.getUpdate();

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
      const tolerance = 0.1; // 0.1m tolerance for position changes
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
        const isStale = staleDuration > 100; // 100 milliseconds for position values

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
  }, [position.getUpdate]);

  useGlobalTicker(() => {
    const value = getDeltaTrackedValue();
    setValueState(value);
  });

  const isStale = positionValue === null;
  const percent = getPercentageFromRange(positionValue || 0, 0, 53.4);

  return (
    <div
      className={styles.pod}
      style={{
        backgroundColor: lostConnection || isStale ? "#cccccc" : "#99ccff",
        borderRadius: "10rem",
      }}
    >
      <img
        src={levion}
        alt="Pod"
        style={{
          position: "absolute",
          top: "50%",
          left: `${percent}%`,
          transform: "translate(-1%, -51%)",
          height: "100%",
          width: "auto",
          borderRadius: "1rem",
          transition: "left 0.2s",
          objectFit: "contain",
          opacity: isStale ? 0.5 : 1,
          filter: lostConnection || isStale ? "grayscale(100%)" : "none",
        }}
      />
    </div>
  );
};
