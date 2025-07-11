import { useContext, useState } from "react";
import styles from "./BoosterPage.module.scss";
import GuiModule from "../../../components/BoosterModules/BoosterModule";
import { useMeasurementsStore, HvscuCabinetMeasurements, getBooleanMeasurement, GlobalTicker, useGlobalTicker, useOrders, BoardOrders, MessagesContainer, BcuMeasurements } from "common";
import { OrdersContainer } from "components/OrdersContainer/OrdersContainer";
import { Window } from "components/Window/Window";
import { getHardcodedOrders } from "../BatteriesPage/FixedOrders";
import { usePodDataUpdate } from 'hooks/usePodDataUpdate';
import { Connection, useConnections } from 'common';
import { LostConnectionContext } from 'services/connections';

interface ModuleData {
  id: number | string;
  name: string;
}

const modules: ModuleData[] = [
  { id: 1, name: "Module 1" },
  { id: 2, name: "Module 2" },
  { id: 3, name: "Module 3" },
];

export function BoosterPage() {
  usePodDataUpdate();
  
  const connections = useConnections();
  const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
  
  const boardOrders = useOrders();
  
  // Medidas
  const totalSupercapsVoltageInfo = getNumericMeasurementInfo(HvscuCabinetMeasurements.TotalVoltage)
  
  const currentMeasurementInfo = getNumericMeasurementInfo(HvscuCabinetMeasurements.CurrentOutput)

  const temperatureMeasurementInfo = getNumericMeasurementInfo(HvscuCabinetMeasurements.Temperature)

  // Enums
  const contactorsStateMeasurement = useMeasurementsStore(
    (state) => state.getEnumMeasurementInfo(HvscuCabinetMeasurements.ContactorsState).getUpdate
  );
  const bcuGeneralStateMeasurement = useMeasurementsStore(
    (state) => state.getEnumMeasurementInfo(BcuMeasurements.generalState).getUpdate
  );
  const bcuOperationalStateMeasurement = useMeasurementsStore(
    (state) => state.getEnumMeasurementInfo(BcuMeasurements.operationalState).getUpdate
  );

  // Estados
  const [voltageTotal, setVoltageTotal] = useState<number | null>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [contactorsState, setContactorsState] = useState(contactorsStateMeasurement);
  const [generalState, setGeneralState] = useState(bcuGeneralStateMeasurement);
  const [operationalState, setOperationalState] = useState(bcuOperationalStateMeasurement);

  useGlobalTicker(() => {
      setVoltageTotal(totalSupercapsVoltageInfo.getUpdate);
      setCurrent(currentMeasurementInfo.getUpdate);
      setTemperature(temperatureMeasurementInfo.getUpdate);
      setContactorsState(contactorsStateMeasurement);
      setGeneralState(bcuGeneralStateMeasurement);
      setOperationalState(bcuOperationalStateMeasurement);
  });

  const bcuState = (generalState == 'Operational') ? operationalState : generalState;

  return (
    <LostConnectionContext.Provider
         value={any(
            [...connections.boards, connections.backend],
             isDisconnected
         )}
    >
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
        <div className={styles.messagesAndOrders}>
          <Window title="Messages" className={styles.messages}>
            <MessagesContainer />
          </Window>
          <Window title="Orders" className={styles.orders}>
              <div className={styles.order_column}>
                  <OrdersContainer boardFilter={['HVSCU-Cabinet']} boardOrdersFilter={getHardcodedOrders}/>
              </div>
          </Window>
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
