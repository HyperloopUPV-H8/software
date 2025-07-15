import React, { useState } from "react";
import styles from "./BatteriesModule.module.scss";
import { useGlobalTicker, useMeasurementsStore } from "common";

interface CellProps {
  value: number;
  min: number;
  max: number;
}

interface TemperatureProps {
  value: number;
  min: number;
  max: number;
  label: string;
}

const BatteriesModule: React.FC<{ id: string | number }> = ({ id }) => {
  const minThresholdCellVoltage = 3.73;
  const maxThresholdCellVoltage = 4.2;
  const minThresholdTemperature = 15;
  const maxThresholdTemperature = 60;
  const temp1VariableName = `HVSCU/battery${id}_temperature1`;
  const temp2VariableName = `HVSCU/battery${id}_temperature2`;
  
  const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
  const [cellValues, setCellValues] = useState<number[]>(Array(6).fill(0));
  const [temperature1, setTemperature1] = useState<number>(0);
  const [temperature2, setTemperature2] = useState<number>(0);

  useGlobalTicker(() => {
    setCellValues(
      Array.from({ length: 6 }, (_, i) => {
        const variableName = `HVSCU/battery${id}_cell${i + 1}`;
        return getNumericMeasurementInfo(variableName)?.getUpdate() ?? 0;
      })
    );
    
    setTemperature1(getNumericMeasurementInfo(temp1VariableName)?.getUpdate() ?? 0);
    setTemperature2(getNumericMeasurementInfo(temp2VariableName)?.getUpdate() ?? 0);
  });

  const getColorFromValue = (value: number, min: number, max: number) => {
    if (value < min) return styles.yellow;
    if (value > max) return styles.red;
    return styles.green;
  };

  const Cell: React.FC<CellProps> = ({ value, min, max }) => {
    const colorClass = getColorFromValue(value, min, max);
    const formattedValue = Math.max(0, Math.min(9.999, value)).toFixed(3);
    return (
      <div
        className={`${styles.cell} ${colorClass}`}
      >
        <span className={styles.cellText}>{formattedValue}V</span>
      </div>
    );
  };

  const TemperatureIndicator: React.FC<TemperatureProps> = ({ value, min, max, label }) => {
    const colorClass = getColorFromValue(value, min, max);
    const formattedValue = value.toFixed(1);
    return (
      <div className={styles.temperatureIndicator}>
        <span className={styles.temperatureLabel}>{label}</span>
        <div className={`${styles.temperatureValue} ${colorClass}`}>
          <span className={styles.temperatureText}>{formattedValue}°C</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.boxContainer1}>
      <div className={styles.boxContainer2}>
        <article className={styles.titleDecorationModule}>
          <h2 className={styles.h2Module}>Segment {id}</h2>
        </article>
        
        <div className={styles.flexCells}>
          {cellValues.map((value, index) => (
            <Cell key={index} value={value} min={minThresholdCellVoltage} max={maxThresholdCellVoltage}/>
          ))}
        </div>
        
        <div className={styles.temperatureContainer}>
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
        </div>
      </div>
    </div>
  );
};

export default BatteriesModule;

