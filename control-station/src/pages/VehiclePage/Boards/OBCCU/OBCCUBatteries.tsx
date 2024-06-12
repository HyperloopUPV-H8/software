import { Window } from "components/Window/Window";
import styles from "./OBCCU.module.scss";
import { ObccuMeasurements } from "common";
import { BatteryPack } from "pages/VehiclePage/Boards/OBCCU/BatteryPack/BatteryPack";
import { BatteryConnector } from "components/BatteryConnector/BatteryConnector";

export const OBCCUBatteries = () => {
    return (
        <Window title="OBCCU">
            <div className={styles.obccu}>
                <div className={styles.batteryRow}>
                    <BatteryPack
                        stateOfChargeMeasurementId={ObccuMeasurements.SOC1}
                        temperatureMeasurementId={ObccuMeasurements.battery_temperature_1}
                        maxCellMeasurementId={ObccuMeasurements.maximumCell1}
                        minCellMeasurementId={ObccuMeasurements.minimumCell1}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage1}
                    />
                    <div className={styles.centerPiece}>
                        <div style={{
                            top: "5%",
                            left: "10%",
                        }} className={styles.connectorIndicator}>
                            1
                        </div>
                        <div style={{
                            top: "5%",
                            right: "10%",
                        }} className={styles.connectorIndicator}>
                            10
                        </div>
                        <BatteryConnector rotate />
                        <BatteryConnector />
                    </div>
                    <BatteryPack
                        stateOfChargeMeasurementId={ObccuMeasurements.SOC10}
                        temperatureMeasurementId={ObccuMeasurements.battery_temperature_10}
                        maxCellMeasurementId={ObccuMeasurements.maximumCell10}
                        minCellMeasurementId={ObccuMeasurements.minimumCell10}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage10}
                    />
                </div>
                <div className={styles.batteryRow}>
                    <BatteryPack
                        stateOfChargeMeasurementId={ObccuMeasurements.SOC2}
                        temperatureMeasurementId={ObccuMeasurements.battery_temperature_2}
                        maxCellMeasurementId={ObccuMeasurements.maximumCell2}
                        minCellMeasurementId={ObccuMeasurements.minimumCell2}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage2}
                    />
                    <div className={styles.centerPiece}>
                        <BatteryConnector rotate />
                        <BatteryConnector />
                    </div>
                    <BatteryPack
                        stateOfChargeMeasurementId={ObccuMeasurements.SOC9}
                        temperatureMeasurementId={ObccuMeasurements.battery_temperature_9}
                        maxCellMeasurementId={ObccuMeasurements.maximumCell9}
                        minCellMeasurementId={ObccuMeasurements.minimumCell9}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage9}
                    />
                </div>
                <div className={styles.batteryRow}>
                    <BatteryPack
                        stateOfChargeMeasurementId={ObccuMeasurements.SOC3}
                        temperatureMeasurementId={ObccuMeasurements.battery_temperature_3}
                        maxCellMeasurementId={ObccuMeasurements.maximumCell3}
                        minCellMeasurementId={ObccuMeasurements.minimumCell3}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage3}
                    />
                    <div className={styles.centerPiece}>
                        <BatteryConnector rotate />
                        <BatteryConnector />
                    </div>
                    <BatteryPack
                        stateOfChargeMeasurementId={ObccuMeasurements.SOC8}
                        temperatureMeasurementId={ObccuMeasurements.battery_temperature_8}
                        maxCellMeasurementId={ObccuMeasurements.maximumCell8}
                        minCellMeasurementId={ObccuMeasurements.minimumCell8}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage8}
                    />
                </div>
                <div className={styles.batteryRow}>
                    <BatteryPack
                        stateOfChargeMeasurementId={ObccuMeasurements.SOC4}
                        temperatureMeasurementId={ObccuMeasurements.battery_temperature_4}
                        maxCellMeasurementId={ObccuMeasurements.maximumCell4}
                        minCellMeasurementId={ObccuMeasurements.minimumCell4}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage4}
                    />
                    <div className={styles.centerPiece}>
                        <BatteryConnector rotate />
                        <BatteryConnector />
                    </div>
                    <BatteryPack
                        stateOfChargeMeasurementId={ObccuMeasurements.SOC7}
                        temperatureMeasurementId={ObccuMeasurements.battery_temperature_7}
                        maxCellMeasurementId={ObccuMeasurements.maximumCell7}
                        minCellMeasurementId={ObccuMeasurements.minimumCell7}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage7}
                    />
                </div>
                <div className={styles.batteryRow}>
                    <BatteryPack
                        stateOfChargeMeasurementId={ObccuMeasurements.SOC5}
                        temperatureMeasurementId={ObccuMeasurements.battery_temperature_5}
                        maxCellMeasurementId={ObccuMeasurements.maximumCell5}
                        minCellMeasurementId={ObccuMeasurements.minimumCell5}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage5}
                    />
                    <div className={styles.centerPiece}>
                        <div style={{
                            bottom: "5%",
                            left: "10%",
                        }} className={styles.connectorIndicator}>
                            5
                        </div>
                        <div style={{
                            bottom: "5%",
                            right: "10%",
                        }} className={styles.connectorIndicator}>
                            6
                        </div>
                        <BatteryConnector rotate />
                        <BatteryConnector />
                    </div>
                    <BatteryPack
                        stateOfChargeMeasurementId={ObccuMeasurements.SOC6}
                        temperatureMeasurementId={ObccuMeasurements.battery_temperature_6}
                        maxCellMeasurementId={ObccuMeasurements.maximumCell6}
                        minCellMeasurementId={ObccuMeasurements.minimumCell6}
                        voltageMeasurementId={ObccuMeasurements.totalVoltage6}
                    />
                </div>
            </div>
        </Window>
    );
};
