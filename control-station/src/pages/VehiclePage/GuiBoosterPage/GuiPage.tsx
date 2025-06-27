import { useEffect, useState } from "react";
import styles from "./GuiPage.module.scss";
import Module from "../../../components/GuiModules/Module";
import { Messages } from "../Messages/Messages";
import { Orders, useMeasurementsStore, NumericMeasurementInfo } from "common";

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
  // Medidas
  const totalSupercapsVoltageInfo = useMeasurementsStore((state) =>
    state.getNumericMeasurementInfo("HVSCU-Cabinet/total_supercaps_voltage")
  );
  const currentMeasurementInfo = useMeasurementsStore((state) =>
    state.getNumericMeasurementInfo("HVSCU-Cabinet/output_current")
  );
  const temperatureMeasurementInfo = useMeasurementsStore((state) =>
    state.getNumericMeasurementInfo("HVSCU-Cabinet/temperature_total")
  );

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

  // Efectos
  useEffect(() => {
    setVoltageTotal(totalSupercapsVoltageInfo?.getUpdate() ?? null); // Si `getUpdate()` es el método adecuado
  }, [totalSupercapsVoltageInfo]);
  
  useEffect(() => {
    setCurrent(currentMeasurementInfo?.getUpdate() ?? null); // Similar para otras mediciones
  }, [currentMeasurementInfo]);
  
  useEffect(() => {
    setTemperature(temperatureMeasurementInfo?.getUpdate() ?? null); 
  }, [temperatureMeasurementInfo]);
  

  useEffect(() => {
    const value = contactorsStateInfo?.value;
    setContactorsState(typeof value === "string" ? value : null);
  }, [contactorsStateInfo]);

  useEffect(() => {
    const value = bcuGeneralStateInfo?.value;
    setBcuState(typeof value === "string" ? value : null);
  }, [bcuGeneralStateInfo]);

  return (
    <div>
      <main className={styles.boosterMainContainer}>
        <div className={styles.boosterContainer}>
          <div className={styles.statusContainer}>
            <div className={styles.statusRow1}>
              <div className={styles.statusItem}>
                <h3>V total:</h3>
                <div className={styles.value}>
                  <span>{voltageTotal ?? "-"} V</span>
                </div>
              </div>
              <div className={styles.statusItem}>
                <h3>Current:</h3>
                <div className={styles.value}>
                  <span>{current ?? "-"} A</span>
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
                  <span>{temperature ?? "-"} ºC</span>
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
              <Module key={module.id} id={module.id} />
            ))}
          </div>
        </div>

        <div className={styles.messagesAndOrders}>
          <div className={styles.messages}>
            <Messages />
          </div>
          <div className={styles.orders}>
            <Orders boards={[]} />
          </div>
        </div>
      </main>
    </div>
  );
}
