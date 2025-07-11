import React, { useEffect, useState } from "react";
import styles from "./BoosterModule.module.scss";

import { useMeasurementsStore } from "common";

interface CellProps {
  value: number;
  min: number;
  max: number;
}

const BoosterModule: React.FC<{ id: string | number }> = ({ id }) => {
  const moduleMinCell = useMeasurementsStore(
    (state) => (state.getNumericMeasurementInfo(`HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_min_cell`)?.getUpdate() ?? 0)
  );
  const moduleMaxCell = useMeasurementsStore(
    (state) => (state.getNumericMeasurementInfo(`HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_max_cell`)?.getUpdate() ?? 0)
  );

  const moduleTotalVoltage = useMeasurementsStore(
    (state) => (state.getNumericMeasurementInfo(`HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_voltage`)?.getUpdate() ?? 0)
  );

  const moduleMaxTemp = useMeasurementsStore(
    (state) => (state.getNumericMeasurementInfo(`HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_max_temp`)?.getUpdate() ?? 0)
  );
  const moduleMinTemp = useMeasurementsStore(
    (state) => (state.getNumericMeasurementInfo(`HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_min_temp`)?.getUpdate() ?? 0)
  );

  // Estado para las celdas
  const [cellValues, setCellValues] = useState<number[]>(Array(48).fill(0)); // Define el tipo correctamente

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCellValues(() =>
        Array.from({ length: 48 }, (_, i) => {
          const variableName = `HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_cell_${i + 1}_voltage`;
          return useMeasurementsStore.getState().getNumericMeasurementInfo(variableName)?.getUpdate() ?? 0;
        })
      );
    }, 100);

    return () => clearInterval(intervalId);
  }, [id]);

  const getColorFromValue = (value: number, min: number, max: number) => {
    if (value < min) return styles.red;
    if (value > max) return styles.red;
    if (value >= min && value <= max) return styles.green;
    return styles.yellow;
  };

  const Cell: React.FC<CellProps> = ({ value, min, max }) => {
    const colorClass = getColorFromValue(value, min, max);
    return (
      <div
        className={`${styles.cell} ${colorClass}`}
        title={`${value.toFixed(3)} V`}
      ></div>
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
            <p className={styles.p}>{`${moduleTotalVoltage.toFixed(2)} V`}</p>
          </div>
          <div className={styles.dataStyle}>
            <p className={styles.moduleInfoLabel}>V max:</p>
            <p className={styles.p}>{`${moduleMaxCell.toFixed(2)} V`}</p>
          </div>
          <div className={styles.dataStyle}>
            <p className={styles.moduleInfoLabel}>V min:</p>
            <p className={styles.p}>{`${moduleMinCell.toFixed(2)} V`}</p>
          </div>
          <div className={styles.dataStyle}>
            <p className={styles.moduleInfoLabel}>Max Temp:</p>
            <p className={styles.p}>{`${moduleMaxTemp.toFixed(2)} °C`}</p>
          </div>
          <div className={styles.dataStyle}>
            <p className={styles.moduleInfoLabel}>Min Temp:</p>
            <p className={styles.p}>{`${moduleMinTemp.toFixed(2)} °C`}</p>
          </div>
        </div>
      </div>
      <div className={styles.flexCells}>
        {cellValues.map((value, index) => (
          <Cell key={index} value={value} min={moduleMinCell} max={moduleMaxCell} />
        ))}
      </div>
    </div>
  );
};

export default BoosterModule;

