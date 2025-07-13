import React, { useState } from "react";
import styles from "./BatteriesModule.module.scss";
import { useGlobalTicker, useMeasurementsStore } from "common";

interface CellProps {
  value: number;
  min: number;
  max: number;
}

const LowVoltageModule: React.FC = () => {
  const minThresholdCellVoltage = 3.67;
  const maxThresholdCellVoltage = 4.2;
  const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
  const [cellValues, setCellValues] = useState<number[]>(Array(6).fill(0));

  useGlobalTicker(() => {
    setCellValues(
      Array.from({ length: 6 }, (_, i) => {
        const variableName = `BMSL/cell_${i + 1}`;
        return getNumericMeasurementInfo(variableName)?.getUpdate() ?? 0;
      })
    );
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
        title={`${value.toFixed(3)} V`}
      >
        <span className={styles.cellText}>{formattedValue}V</span>
      </div>
    );
  };
  return (
    <div className={styles.boxContainer1}>
      <div className={styles.boxContainer2}>
        <article className={styles.titleDecorationModule}>
          <h2 className={styles.h2Module}>Low Voltage</h2>
        </article>
        
        <div className={styles.flexCells}>
          {cellValues.map((value, index) => (
            <Cell key={index} value={value} min={minThresholdCellVoltage} max={maxThresholdCellVoltage}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LowVoltageModule;
