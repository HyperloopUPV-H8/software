import { useEffect, useState } from "react";
import styles from "./GuiPage.module.scss";
import Module from "../../../components/GuiModules/Module";
import { Messages } from "../Messages/Messages";
import { Orders, useMeasurementsStore } from "common";

interface ModuleData {
    id: number | string;
    name: string;
};

const modules: ModuleData[] = [
    { id: 1, name: "Module 1" },
    { id: 2, name: "Module 2" },
    { id: 3, name: "Module 3" },
];

export function GuiPage() {

    const voltageTotalMeasurement = useMeasurementsStore((state) =>
        state.getNumericMeasurementInfo("total_voltage_high")
    );
    
    const currentMeasurement = useMeasurementsStore((state) =>
        state.getNumericMeasurementInfo("vdc")
    );

    const constStatusMeasurement = useMeasurementsStore((state) =>
        state.getBooleanMeasurementInfo("const_status")
    );

    const [voltageTotal, setVoltageTotal] = useState<number | null>(null);
    const [bcuVoltage, setBcuVoltage] = useState<number | null>(null);
    const [constStatus, setConstStatus] = useState<boolean>(false);

    useEffect(() => {
        // (VER)
        setVoltageTotal(voltageTotalMeasurement?.getUpdate() || null);
        setConstStatus(constStatusMeasurement.getUpdate());
    }, [voltageTotalMeasurement, constStatusMeasurement]);

    useEffect(() => {
        if (currentMeasurement?.getUpdate) {
            const newValue = currentMeasurement.getUpdate();
            console.log("Nuevo valor BCU Voltage:", newValue);
            setBcuVoltage(newValue);
        }
    }, [currentMeasurement]);

    return (
        <div>
            <main className={styles.boosterMainContainer}>
                <div className={styles.boosterContainer}>
                    <div className={styles.statusContainer}>
                        <div className={styles.statusFirstLabel}>
                            <h3>V total:</h3>
                            <div className={styles.value}>
                                <span>{voltageTotal} V</span>
                            </div>

                            <h3>Current:</h3>
                            <div className={styles.value}>
                                <span>{bcuVoltage} V</span>
                            </div>

                            <h3>Contactors status:</h3>
                            <div className={styles.value}>
                                <span>{constStatus ? "On" : "Off"}</span> {/* Muestra On/Off para el estado de los contactores */}
                            </div>
                        </div>
                        <div className={styles.statusFirstLabel}>
                            <h3>BCU status:</h3>
                            <div className={styles.value}>
                                <span>{voltageTotal} -</span>
                            </div>

                            <h3>Temperature total:</h3>
                            <div className={styles.value}>
                                <span>{bcuVoltage} ºC</span>
                            </div>

                            <h3>Charge:</h3>
                            <div className={styles.value}>
                                <span>{} %</span> {/* Muestra On/Off para el estado de los contactores */}
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

                    <div className={styles.orders}></div>
                    <Orders boards={[]} />
                </div>
            </main>
        </div>
    );
}