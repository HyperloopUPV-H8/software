import React, { useEffect, useState } from "react";
import styles from "./BoosterModule.module.scss";

import { useMeasurementsStore, useGlobalTicker } from "common";

interface CellProps {
  value: number;
}

const BoosterModule: React.FC<{ id: string | number }> = ({ id }) => {
  const minThresholdCellVoltage = 3.73;
  const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
  
  // Estados para todos los valores
  const [moduleMinCell, setModuleMinCell] = useState<number>(0);
  const [moduleMaxCell, setModuleMaxCell] = useState<number>(0);
  const [moduleTotalVoltage, setModuleTotalVoltage] = useState<number>(0);
  const [moduleMaxTemp, setModuleMaxTemp] = useState<number>(0);
  const [moduleMinTemp, setModuleMinTemp] = useState<number>(0);
  const [cellValues, setCellValues] = useState<number[]>(Array(48).fill(0));

  useGlobalTicker(() => {
    // Actualizar valores del módulo
    setModuleMinCell(getNumericMeasurementInfo(`HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_min_cell`)?.getUpdate() ?? 0);
    setModuleMaxCell(getNumericMeasurementInfo(`HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_max_cell`)?.getUpdate() ?? 0);
    setModuleTotalVoltage(getNumericMeasurementInfo(`HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_voltage`)?.getUpdate() ?? 0);
    setModuleMaxTemp(getNumericMeasurementInfo(`HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_max_temp`)?.getUpdate() ?? 0);
    setModuleMinTemp(getNumericMeasurementInfo(`HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_min_temp`)?.getUpdate() ?? 0);
    
    // Actualizar valores de las celdas
    setCellValues(
      Array.from({ length: 48 }, (_, i) => {
        const variableName = `HVSCU-Cabinet/HVSCU-Cabinet_module_${id}_cell_${i + 1}_voltage`;
        return getNumericMeasurementInfo(variableName)?.getUpdate() ?? 0;
      })
    );
  });

  const Cell: React.FC<CellProps> = ({ value }) => {
    return (
      <div
        className={`${styles.cell} ${styles.green}`}
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
          <Cell key={index} value={value} />
        ))}
      </div>
    </div>
  );
};

export default BoosterModule;

