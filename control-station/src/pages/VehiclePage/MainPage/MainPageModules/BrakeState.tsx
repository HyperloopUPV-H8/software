import {
  VcuMeasurements,
  useGlobalTicker,
  useMeasurementsStore,
  usePodDataStore,
} from "common";
import { useContext, useState, useRef, useMemo } from "react";
import { LostConnectionContext } from "services/connections";
import { DELTA_SAMPLE_PERIOD, DELTA_GRACE_PERIOD } from "constants/deltaTracking";
import styles from "../MainPage.module.scss";

export const BrakeState = () => {
  const getValue = useMeasurementsStore(
    (state) =>
      state.getBooleanMeasurementInfo(VcuMeasurements.allReeds).getUpdate,
  );

  const podData = usePodDataStore((state) => state.podData);
  const lostConnection = useContext(LostConnectionContext);

  const [hasReceivedData, setHasReceivedData] = useState(false);
  const [ReedsState, setVariant] = useState<boolean | null>(false);

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

      // Check if sample period has passed since last sample
      if (prevData && now - prevData.lastSampleTime < DELTA_SAMPLE_PERIOD) {
        // Not enough time passed, return current value if not stale, otherwise null
        const currentValue = getValue();
        return prevData.isStale ? null : currentValue;
      }

      // Sample period has passed or no previous data, get fresh value
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
        const isStale = staleDuration > DELTA_GRACE_PERIOD; // Grace period for boolean values

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
    const vcuBoard = podData.boards.find((board) => board.name === "VCU");
    const hasReceivedPackets =
      vcuBoard?.packets.some((packet) => packet.count > 0) || false;

    const currentValue = getDeltaTrackedValue();
    setVariant(currentValue);

    if (hasReceivedPackets && !hasReceivedData) {
      setHasReceivedData(true);
    }
  });

  const showDisconnected =
    lostConnection || !hasReceivedData || ReedsState === null;

  return (
    <div
      className={styles.break_state}
      style={{
        backgroundColor: showDisconnected
          ? "#cccccc"
          : ReedsState
            ? "#f3785c"
            : "#99ccff",
      }}
    >
      <div
        style={{
          color: showDisconnected
            ? "#888888"
            : ReedsState
              ? "#571500"
              : "#0059b3",
        }}
      >
        {showDisconnected ? "DISCONNECTED" : ReedsState ? "BRAKED" : "UNBRAKED"}
      </div>
    </div>
  );
};
