import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import styles from "./BoosterModule.module.scss";

import { useMeasurementsStore, useGlobalTicker, usePodDataStore } from "common";
import { LostConnectionContext } from "services/connections";

interface CellProps {
  value: number | null;
}

const BoosterModule: React.FC<{ id: string | number }> = ({ id }) => {
  const minThresholdCellVoltage = 3.73;
  const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
  const podData = usePodDataStore((state) => state.podData);
  const lostConnection = useContext(LostConnectionContext);
  
  // Estados para todos los valores
  const [moduleMinCell, setModuleMinCell] = useState<number | null>(0);
  const [moduleMaxCell, setModuleMaxCell] = useState<number | null>(0);
  const [moduleTotalVoltage, setModuleTotalVoltage] = useState<number | null>(0);
  const [moduleMaxTemp, setModuleMaxTemp] = useState<number | null>(0);
  const [moduleMinTemp, setModuleMinTemp] = useState<number | null>(0);
  const [cellValues, setCellValues] = useState<(number | null)[]>(Array(48).fill(0));
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
        const tolerance = 0.01; // Small tolerance for voltage values
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
    const boardName = 'HVSCU-Cabinet';
    const board = podData.boards.find(b => b.name === boardName);
    const hasReceivedPackets = board?.packets.some(packet => packet.count > 0) || false;
    
    if (hasReceivedPackets && !hasReceivedData) {
      setHasReceivedData(true);
    }
    
    // Actualizar valores del módulo con delta tracking
    const moduleValues = [
      { key: `min_cell_${id}`, varName: `HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_min_cell`, setter: setModuleMinCell },
      { key: `max_cell_${id}`, varName: `HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_max_cell`, setter: setModuleMaxCell },
      { key: `voltage_${id}`, varName: `HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_voltage`, setter: setModuleTotalVoltage },
      { key: `max_temp_${id}`, varName: `HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_max_temp`, setter: setModuleMaxTemp },
      { key: `min_temp_${id}`, varName: `HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_min_temp`, setter: setModuleMinTemp },
    ];
    
    moduleValues.forEach(({ key, varName, setter }) => {
      const measurementInfo = getNumericMeasurementInfo(varName);
      if (measurementInfo) {
        const deltaGetter = createDeltaTrackedGetter(key, measurementInfo.getUpdate);
        setter(deltaGetter());
      }
    });
    
    // Actualizar valores de las celdas con delta tracking
    setCellValues(
      Array.from({ length: 48 }, (_, i) => {
        const variableName = `HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_cell_${i + 1}_voltage`;
        const measurementInfo = getNumericMeasurementInfo(variableName);
        if (!measurementInfo) return null;
        const deltaGetter = createDeltaTrackedGetter(`cell_${id}_${i}`, measurementInfo.getUpdate);
        return deltaGetter();
      })
    );
  });

  const showDisconnected = lostConnection || !hasReceivedData;

  const Cell: React.FC<CellProps> = ({ value }) => {
    const isStale = value === null;
    const displayValue = value !== null ? value : 0;
    const formattedValue = isStale || showDisconnected ? "-.---" : Math.max(0, Math.min(99.999, displayValue)).toFixed(3);
    return (
      <div
        className={`${styles.cell} ${(showDisconnected || isStale) ? styles.disconnected : styles.green}`}
        title={showDisconnected || isStale ? "DISCONNECTED" : `${displayValue.toFixed(3)} V`}
      >
        <span className={styles.cellText}>{formattedValue}{(showDisconnected || isStale) ? "" : "V"}</span>
      </div>
    );
  };

  return (
    <div className={styles.boxContainer1}>
      <div className={styles.boxContainer2}>
        <article className={styles.titleDecorationModule}>
          <h2 className={styles.h2Module}>Module {id}</h2>
        </article>

        <div className={styles.voltageContainer}>
          <div className={styles.dataStyle}>
            <p className={styles.moduleInfoLabel}>Total V:</p>
            <p className={styles.p}>{moduleTotalVoltage === null ? "-.--" : `${moduleTotalVoltage.toFixed(2)} V`}</p>
          </div>
          <div className={styles.dataStyle}>
            <p className={styles.moduleInfoLabel}>V max:</p>
            <p className={styles.p}>{moduleMaxCell === null ? "-.--" : `${moduleMaxCell.toFixed(2)} V`}</p>
          </div>
          <div className={styles.dataStyle}>
            <p className={styles.moduleInfoLabel}>V min:</p>
            <p className={styles.p}>{moduleMinCell === null ? "-.--" : `${moduleMinCell.toFixed(2)} V`}</p>
          </div>
          <div className={styles.dataStyle}>
            <p className={styles.moduleInfoLabel}>Max Temp:</p>
            <p className={styles.p}>{moduleMaxTemp === null ? "-.--" : `${moduleMaxTemp.toFixed(2)} °C`}</p>
          </div>
          <div className={styles.dataStyle}>
            <p className={styles.moduleInfoLabel}>Min Temp:</p>
            <p className={styles.p}>{moduleMinTemp === null ? "-.--" : `${moduleMinTemp.toFixed(2)} °C`}</p>
          </div>
        </div>
      </div>
      <div className={styles.flexCells}>
        {cellValues.map((value, index) => (
          <Cell key={index} value={value} />
        ))}
      </div>
    </div>
  );
};

export default BoosterModule;

