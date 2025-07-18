import React, { useState, useContext, useRef, useMemo } from "react";
import styles from "./BatteriesModule.module.scss";
import { useGlobalTicker, useMeasurementsStore, usePodDataStore } from "common";
import { LostConnectionContext } from "services/connections";

interface CellProps {
  value: number | null;
  min: number;
  max: number;
}

interface TemperatureProps {
  value: number | null;
  min: number;
  max: number;
  label: string;
}

const LowVoltageModule: React.FC = () => {
  const minThresholdCellVoltage = 3.67;
  const maxThresholdCellVoltage = 4.2;
  const minThresholdTemperature = 0;
  const maxThresholdTemperature = 60;
  const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
  const podData = usePodDataStore((state) => state.podData);
  const lostConnection = useContext(LostConnectionContext);
  
  const [cellValues, setCellValues] = useState<(number | null)[]>(Array(6).fill(0));
  const [temperature1, setTemperature1] = useState<number | null>(0);
  const [temperature2, setTemperature2] = useState<number | null>(0);
  const [temperature3, setTemperature3] = useState<number | null>(0);
  const [temperature4, setTemperature4] = useState<number | null>(0);
  const [hasReceivedData, setHasReceivedData] = useState(false);
  
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
        
        // Check if 400ms have passed since last sample
        if (prevData && now - prevData.lastSampleTime < 400) {
          // Not enough time passed, return current value if not stale, otherwise null
          const currentValue = originalGetter();
          return prevData.isStale ? null : currentValue;
        }
        
        // 400ms have passed or no previous data, get fresh value
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
        const tolerance = 0.01; // Small tolerance for battery values
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
          const isStale = staleDuration > 100; // 100ms grace period
          
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
    const boardName = 'BMSL';
    const board = podData.boards.find(b => b.name === boardName);
    const hasReceivedPackets = board?.packets.some(packet => packet.count > 0) || false;
    
    if (hasReceivedPackets && !hasReceivedData) {
      setHasReceivedData(true);
    }
    
    setCellValues(
      Array.from({ length: 6 }, (_, i) => {
        const variableName = `BMSL/cell_${i + 1}`;
        const measurementInfo = getNumericMeasurementInfo(variableName);
        if (!measurementInfo) return null;
        const deltaTrackedGetter = createDeltaTrackedGetter(variableName, measurementInfo.getUpdate);
        return deltaTrackedGetter();
      })
    );
    
    const tempMeasurements = [
      { name: "BMSL/temperature_1", setter: setTemperature1 },
      { name: "BMSL/temperature_2", setter: setTemperature2 },
      { name: "BMSL/temperature_3", setter: setTemperature3 },
      { name: "BMSL/temperature_4", setter: setTemperature4 },
    ];
    
    tempMeasurements.forEach(({ name, setter }) => {
      const tempInfo = getNumericMeasurementInfo(name);
      if (tempInfo) {
        const tempGetter = createDeltaTrackedGetter(name, tempInfo.getUpdate);
        setter(tempGetter());
      }
    });
  });

  const getColorFromValue = (value: number | null, min: number, max: number, showDisconnected: boolean) => {
    if (showDisconnected || value === null) return styles.disconnected;
    if (value < min) return styles.yellow;
    if (value > max) return styles.red;
    return styles.green;
  };

  const showDisconnected = lostConnection || !hasReceivedData;

  const Cell: React.FC<CellProps> = ({ value, min, max }) => {
    const isStale = value === null;
    const colorClass = getColorFromValue(value, min, max, showDisconnected || isStale);
    const displayValue = value !== null ? value : 0;
    const formattedValue = isStale || showDisconnected ? "-.---" : Math.max(0, Math.min(9.999, displayValue)).toFixed(3);
    return (
      <div
        className={`${styles.cell} ${colorClass}`}
        title={showDisconnected || isStale ? "DISCONNECTED" : `${displayValue.toFixed(3)} V`}
      >
        <span className={styles.cellText}>{formattedValue}{(showDisconnected || isStale) ? "" : "V"}</span>
      </div>
    );
  };

  const TemperatureIndicator: React.FC<TemperatureProps> = ({ value, min, max, label }) => {
    const isStale = value === null;
    const colorClass = getColorFromValue(value, min, max, showDisconnected || isStale);
    const displayValue = value !== null ? value : 0;
    const formattedValue = isStale || showDisconnected ? "-.--" : displayValue.toFixed(1);
    return (
      <div className={styles.temperatureIndicator}>
        <span className={styles.temperatureLabel}>{label}</span>
        <div className={`${styles.temperatureValue} ${colorClass}`}>
          <span className={styles.temperatureText}>{formattedValue}{(showDisconnected || isStale) ? "" : "°C"}</span>
        </div>
      </div>
    );
  };
  return (
    <div className={styles.lowVoltageBoxContainer1}>
      <div className={styles.lowVoltageBoxContainer2}>
        <article className={styles.titleDecorationModule}>
          <h2 className={styles.h2Module}>Low Voltage</h2>
        </article>
        
        <div className={styles.flexCells}>
          {cellValues.map((value, index) => (
            <Cell key={index} value={value} min={minThresholdCellVoltage} max={maxThresholdCellVoltage}/>
          ))}
        </div>
        
        <div className={styles.lowVoltageTemperatureContainer}>
          <TemperatureIndicator 
            value={temperature1} 
            min={minThresholdTemperature} 
            max={maxThresholdTemperature} 
            label="T1" 
          />
          <TemperatureIndicator 
            value={temperature2} 
            min={minThresholdTemperature} 
            max={maxThresholdTemperature} 
            label="T2" 
          />
          <TemperatureIndicator 
            value={temperature3} 
            min={minThresholdTemperature} 
            max={maxThresholdTemperature} 
            label="T3" 
          />
          <TemperatureIndicator 
            value={temperature4} 
            min={minThresholdTemperature} 
            max={maxThresholdTemperature} 
            label="T4" 
          />
        </div>
      </div>
    </div>
  );
};

export default LowVoltageModule;
