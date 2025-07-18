import { useState, useRef, useMemo } from "react";
import styles from "./BatteriesPage.module.scss";
import BatteriesModule from "components/BatteriesModules/BatteriesModule";
import LowVoltageModule from "components/BatteriesModules/LowVoltageModule";
import {
  useMeasurementsStore,
  HvscuCabinetMeasurements,
  useGlobalTicker,
  BcuMeasurements,
  HvscuMeasurements,
  BmslMeasurements,
  usePodDataStore,
} from "common";
import { usePodDataUpdate } from "hooks/usePodDataUpdate";
import { Connection, useConnections } from "common";
import { LostConnectionContext } from "services/connections";
import { Window } from "components/Window/Window";
import { DELTA_SAMPLE_PERIOD, DELTA_GRACE_PERIOD } from "constants/deltaTracking";

interface ModuleData {
  id: number | string;
  name: string;
}

const highVoltageGroup1: ModuleData[] = [
  { id: 1, name: "Module 1" },
  { id: 2, name: "Module 2" },
  { id: 3, name: "Module 3" },
  { id: 4, name: "Module 4" },
  { id: 5, name: "Module 5" },
  { id: 6, name: "Module 6" },
];

const highVoltageGroup2: ModuleData[] = [
  { id: 7, name: "Module 7" },
  { id: 8, name: "Module 8" },
  { id: 9, name: "Module 9" },
  { id: 10, name: "Module 10" },
  { id: 11, name: "Module 11" },
  { id: 12, name: "Module 12" },
];

const highVoltageGroup3: ModuleData[] = [
  { id: 13, name: "Module 13" },
  { id: 14, name: "Module 14" },
  { id: 15, name: "Module 15" },
  { id: 16, name: "Module 16" },
  { id: 17, name: "Module 17" },
  { id: 18, name: "Module 18" },
];

export function BatteriesPage() {
  usePodDataUpdate();

  const connections = useConnections();
  const getNumericMeasurementInfo = useMeasurementsStore(
    (state) => state.getNumericMeasurementInfo,
  );

  const totalVoltageHighMeasurement = getNumericMeasurementInfo(
    HvscuMeasurements.BatteriesVoltage,
  );
  const maxVoltageHighMeasurement = getNumericMeasurementInfo(
    HvscuMeasurements.VoltageMax,
  );
  const minVoltageHighMeasurement = getNumericMeasurementInfo(
    HvscuMeasurements.VoltageMin,
  );
  const maxTempHighMeasurement = getNumericMeasurementInfo(
    HvscuMeasurements.TempMax,
  );
  const minTempHighMeasurement = getNumericMeasurementInfo(
    HvscuMeasurements.TempMin,
  );

  const totalVoltageLowMeasurement = getNumericMeasurementInfo(
    BmslMeasurements.totalVoltage,
  );
  const maxVoltageLowMeasurement = getNumericMeasurementInfo(
    BmslMeasurements.voltageMax,
  );
  const minVoltageLowMeasurement = getNumericMeasurementInfo(
    BmslMeasurements.voltageMin,
  );
  const maxTempLowMeasurement = getNumericMeasurementInfo(
    BmslMeasurements.tempMax,
  );
  const minTempLowMeasurement = getNumericMeasurementInfo(
    BmslMeasurements.tempMin,
  );

  const [voltageTotal, setVoltageTotal] = useState<number | null>(null);
  const [maxVoltageHigh, setMaxVoltageHigh] = useState<number | null>(null);
  const [minVoltageHigh, setMinVoltageHigh] = useState<number | null>(null);
  const [maxTempHigh, setMaxTempHigh] = useState<number | null>(null);
  const [minTempHigh, setMinTempHigh] = useState<number | null>(null);

  const [voltageTotalLow, setVoltageTotalLow] = useState<number | null>(null);
  const [maxVoltageLow, setMaxVoltageLow] = useState<number | null>(null);
  const [minVoltageLow, setMinVoltageLow] = useState<number | null>(null);
  const [maxTempLow, setMaxTempLow] = useState<number | null>(null);
  const [minTempLow, setMinTempLow] = useState<number | null>(null);
  
  const [hasReceivedDataHV, setHasReceivedDataHV] = useState(false);
  const [hasReceivedDataLV, setHasReceivedDataLV] = useState(false);
  
  const podData = usePodDataStore((state) => state.podData);
  
  // Delta tracking state for all values
  const deltaTrackingRef = useRef<{
    [key: string]: {
      value: number | null;
      lastSampleTime: number;
      lastChangeTime: number;
      isStale: boolean;
    };
  }>({});

  // Create delta-tracked getter for numeric values
  const createDeltaTrackedGetter = useMemo(() => {
    return (key: string, originalGetter: () => number) => {
      return () => {
        const now = Date.now();
        const prevData = deltaTrackingRef.current[key];
        
        // Check if sample period has passed since last sample
        if (prevData && now - prevData.lastSampleTime < DELTA_SAMPLE_PERIOD) {
          // Not enough time passed, return current value if not stale, otherwise null
          const currentValue = originalGetter();
          return prevData.isStale ? null : currentValue;
        }
        
        // Sample period has passed or no previous data, get fresh value
        const currentValue = originalGetter();
        
        // Initialize if no previous data
        if (!prevData) {
          deltaTrackingRef.current[key] = {
            value: currentValue,
            lastSampleTime: now,
            lastChangeTime: now,
            isStale: false,
          };
          return currentValue;
        }
        
        // Check for delta with tolerance
        const prevValue = prevData.value;
        const tolerance = 0.1; // Tolerance for battery values
        const hasChanged = prevValue === null || currentValue === null 
          ? prevValue !== currentValue 
          : Math.abs(prevValue - currentValue) > tolerance;
        
        if (hasChanged) {
          // Value changed significantly, update everything
          deltaTrackingRef.current[key] = {
            value: currentValue,
            lastSampleTime: now,
            lastChangeTime: now,
            isStale: false,
          };
          return currentValue;
        } else {
          // Value hasn't changed significantly, check if it's been stale for too long
          const staleDuration = now - prevData.lastChangeTime;
          const isStale = staleDuration > DELTA_GRACE_PERIOD; // Grace period
          
          deltaTrackingRef.current[key] = {
            value: currentValue,
            lastSampleTime: now,
            lastChangeTime: prevData.lastChangeTime,
            isStale: isStale,
          };
          return isStale ? null : currentValue;
        }
      };
    };
  }, []);

  useGlobalTicker(() => {
    // Check if we've received data from HVSCU board
    const hvscuBoard = podData.boards.find((board) => board.name === "HVSCU");
    const hasReceivedHVPackets = hvscuBoard?.packets.some((packet) => packet.count > 0) || false;
    if (hasReceivedHVPackets && !hasReceivedDataHV) {
      setHasReceivedDataHV(true);
    }
    
    // Check if we've received data from BMSL board
    const bmslBoard = podData.boards.find((board) => board.name === "BMSL");
    const hasReceivedLVPackets = bmslBoard?.packets.some((packet) => packet.count > 0) || false;
    if (hasReceivedLVPackets && !hasReceivedDataLV) {
      setHasReceivedDataLV(true);
    }
    
    // High voltage measurements with delta tracking
    setVoltageTotal(createDeltaTrackedGetter('hv_total_voltage', totalVoltageHighMeasurement.getUpdate)());
    setMaxVoltageHigh(createDeltaTrackedGetter('hv_max_voltage', maxVoltageHighMeasurement.getUpdate)());
    setMinVoltageHigh(createDeltaTrackedGetter('hv_min_voltage', minVoltageHighMeasurement.getUpdate)());
    setMaxTempHigh(createDeltaTrackedGetter('hv_max_temp', maxTempHighMeasurement.getUpdate)());
    setMinTempHigh(createDeltaTrackedGetter('hv_min_temp', minTempHighMeasurement.getUpdate)());

    // Low voltage measurements with delta tracking
    setVoltageTotalLow(createDeltaTrackedGetter('lv_total_voltage', totalVoltageLowMeasurement.getUpdate)());
    setMaxVoltageLow(createDeltaTrackedGetter('lv_max_voltage', maxVoltageLowMeasurement.getUpdate)());
    setMinVoltageLow(createDeltaTrackedGetter('lv_min_voltage', minVoltageLowMeasurement.getUpdate)());
    setMaxTempLow(createDeltaTrackedGetter('lv_max_temp', maxTempLowMeasurement.getUpdate)());
    setMinTempLow(createDeltaTrackedGetter('lv_min_temp', minTempLowMeasurement.getUpdate)());
  });

  return (
    <LostConnectionContext.Provider
      value={any([...connections.boards, connections.backend], isDisconnected)}
    >
      <main className={styles.batteriesMainContainer}>
        <div className={styles.batteriesContainer}>
          <div className={styles.sectionContainer}>
            <div className={styles.statusContainer}>
              <Window title="High Voltage Batteries">
                <div className={styles.statusRow1}>
                  <div className={styles.statusItem}>
                    <h3>Total Voltage:</h3>
                    <div className={styles.value}>
                      <span>{voltageTotal === null || !hasReceivedDataHV ? "-.--" : `${voltageTotal.toFixed(1)}V`}</span>
                    </div>
                  </div>
                  <div className={styles.statusItem}>
                    <h3>Max V:</h3>
                    <div className={styles.value}>
                      <span>{maxVoltageHigh === null || !hasReceivedDataHV ? "-.--" : `${maxVoltageHigh.toFixed(2)}V`}</span>
                    </div>
                  </div>
                  <div className={styles.statusItem}>
                    <h3>Min V:</h3>
                    <div className={styles.value}>
                      <span>{minVoltageHigh === null || !hasReceivedDataHV ? "-.--" : `${minVoltageHigh.toFixed(2)}V`}</span>
                    </div>
                  </div>
                  <div className={styles.statusItem}>
                    <h3>Max Temp:</h3>
                    <div className={styles.value}>
                      <span>{maxTempHigh === null || !hasReceivedDataHV ? "-.--" : `${maxTempHigh.toFixed(1)}°C`}</span>
                    </div>
                  </div>
                  <div className={styles.statusItem}>
                    <h3>Min Temp:</h3>
                    <div className={styles.value}>
                      <span>{minTempHigh === null || !hasReceivedDataHV ? "-.--" : `${minTempHigh.toFixed(1)}°C`}</span>
                    </div>
                  </div>
                </div>
              </Window>
            </div>
          </div>

          <div className={styles.sectionContainer}>
            <div className={styles.modulesContainer}>
              {highVoltageGroup1.map((module) => (
                <BatteriesModule key={module.id} id={module.id} />
              ))}
            </div>
          </div>

          <div className={styles.sectionContainer}>
            <div className={styles.modulesContainer}>
              {highVoltageGroup2.map((module) => (
                <BatteriesModule key={module.id} id={module.id} />
              ))}
            </div>
          </div>

          <div className={styles.sectionContainer}>
            <div className={styles.modulesContainer}>
              {highVoltageGroup3.map((module) => (
                <BatteriesModule key={module.id} id={module.id} />
              ))}
            </div>
          </div>

          <div className={styles.sectionContainer}>
            <div className={styles.statusContainer}>
              <Window title="Low Voltage Battery">
                <div className={styles.statusRow1}>
                  <div className={styles.statusItem}>
                    <h3>Total Voltage:</h3>
                    <div className={styles.value}>
                      <span>{voltageTotalLow === null || !hasReceivedDataLV ? "-.--" : `${voltageTotalLow.toFixed(1)}V`}</span>
                    </div>
                  </div>
                  <div className={styles.statusItem}>
                    <h3>Max V:</h3>
                    <div className={styles.value}>
                      <span>{maxVoltageLow === null || !hasReceivedDataLV ? "-.--" : `${maxVoltageLow.toFixed(2)}V`}</span>
                    </div>
                  </div>
                  <div className={styles.statusItem}>
                    <h3>Min V:</h3>
                    <div className={styles.value}>
                      <span>{minVoltageLow === null || !hasReceivedDataLV ? "-.--" : `${minVoltageLow.toFixed(2)}V`}</span>
                    </div>
                  </div>
                  <div className={styles.statusItem}>
                    <h3>Max Temp:</h3>
                    <div className={styles.value}>
                      <span>{maxTempLow === null || !hasReceivedDataLV ? "-.--" : `${maxTempLow.toFixed(1)}°C`}</span>
                    </div>
                  </div>
                  <div className={styles.statusItem}>
                    <h3>Min Temp:</h3>
                    <div className={styles.value}>
                      <span>{minTempLow === null || !hasReceivedDataLV ? "-.--" : `${minTempLow.toFixed(1)}°C`}</span>
                    </div>
                  </div>
                </div>
              </Window>
            </div>
          </div>

          <div className={styles.sectionContainer}>
            <div className={styles.lowVoltageContainer}>
              <LowVoltageModule />
            </div>
          </div>
        </div>
      </main>
    </LostConnectionContext.Provider>
  );
}

function isDisconnected(connection: Connection): boolean {
  return !connection.isConnected;
}

function all<T>(data: T[], condition: (value: T) => boolean): boolean {
  for (const value of data) {
    if (!condition(value)) {
      return false;
    }
  }
  return true;
}

function any<T>(data: T[], condition: (value: T) => boolean): boolean {
  for (const value of data) {
    if (condition(value)) {
      return true;
    }
  }
  return false;
}
