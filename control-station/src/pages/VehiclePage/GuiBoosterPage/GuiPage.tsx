import { useEffect, useState } from "react";
import styles from "./GuiPage.module.scss";
import GuiModule from "../../../components/GuiModules/GuiModule";
import { Messages } from "../Messages/Messages";
import { Orders, useMeasurementsStore, HvscuCabinetMeasurements, getBooleanMeasurement, GlobalTicker, useGlobalTicker } from "common";

interface ModuleData {
  id: number | string;
  name: string;
}

const modules: ModuleData[] = [
  { id: 1, name: "Module 1" },
  { id: 2, name: "Module 2" },
  { id: 3, name: "Module 3" },
];

export function GuiPage() {
  const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
  // Medidas
  const totalSupercapsVoltageInfo = getNumericMeasurementInfo(HvscuCabinetMeasurements.TotalVoltage)
  
  const currentMeasurementInfo = getNumericMeasurementInfo(HvscuCabinetMeasurements.CurrentReading)

  const temperatureMeasurementInfo = getNumericMeasurementInfo(HvscuCabinetMeasurements.Temperature)

  // Enums
  const contactorsStateInfo = useMeasurementsStore((state) =>
    state.getMeasurement("HVSCU-Cabinet/contactors_state")
  );
  const bcuGeneralStateInfo = useMeasurementsStore((state) =>
    state.getMeasurement("HVSCU-Cabinet/BCU_state_master_nested")
  );

  // Estados
  const [voltageTotal, setVoltageTotal] = useState<number | null>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [contactorsState, setContactorsState] = useState<string | null>(null);
  const [bcuState, setBcuState] = useState<string | null>(null);

  useGlobalTicker(() => {
      setVoltageTotal(totalSupercapsVoltageInfo.getUpdate);
      setCurrent(currentMeasurementInfo.getUpdate);
      setTemperature(temperatureMeasurementInfo.getUpdate);
  });

  return (
    <div>
      <main className={styles.boosterMainContainer}>
        <div className={styles.boosterContainer}>
          <div className={styles.statusContainer}>
            <div className={styles.statusRow1}>
              <div className={styles.statusItem}>
                <h3>V total:</h3>
                <div className={styles.value}>
                  <span>{voltageTotal?.toFixed(2) ?? "-"} V</span>
                </div>
              </div>
              <div className={styles.statusItem}>
                <h3>Current:</h3>
                <div className={styles.value}>
                  <span>{current?.toFixed(2) ?? "-"} A</span>
                </div>
              </div>
              <div className={styles.statusItem}>
                <h3>Contactors status:</h3>
                <div className={styles.value}>
                  <span>{contactorsState ?? "-"}</span>
                </div>
              </div>
            </div>
            <div className={styles.statusRow2}>
              <div className={styles.statusItem}>
                <h3>BCU status:</h3>
                <div className={styles.value}>
                  <span>{bcuState ?? "-"}</span>
                </div>
              </div>
              <div className={styles.statusItem}>
                <h3>Temperature total:</h3>
                <div className={styles.value}>
                  <span>{temperature?.toFixed(2) ?? "-"} ºC</span>
                </div>
              </div>
              <div className={styles.statusItem}>
                <h3>Charge:</h3>
                <div className={styles.value}>
                  <span>- %</span> 
                </div>
              </div>
            </div>
          </div>

          <div className={styles.modulesContainer}>
            {modules.map((module) => (
              <GuiModule key={module.id} id={module.id} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
