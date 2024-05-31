import { Window } from "components/Window/Window";
import styles from "./OBCCU.module.scss";
import { ObccuMeasurements } from "common";
import { BatteryPack } from "pages/VehiclePage/Boards/OBCCU/BatteryPack/BatteryPack";
import { BatteryConnector } from "components/BatteryConnector/BatteryConnector";

export const OBCCUBatteries = (props: ObccuMeasurements) => {
    return (
        <Window title="OBCCU">
            <div className={styles.obccu}>
                <div className={styles.batteryRow}>
                    <BatteryPack
                        stateOfChargeMeasurement={props.SOC1}
                        temperatureMeasurement={props.battery_temperature_1}
                        maxCellMeasurement={props.maximumCell1}
                        minCellMeasurement={props.minimumCell1}
                        voltageMeasurement={props.totalVoltage1}
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
                        stateOfChargeMeasurement={props.SOC10}
                        temperatureMeasurement={props.battery_temperature_10}
                        maxCellMeasurement={props.maximumCell10}
                        minCellMeasurement={props.minimumCell10}
                        voltageMeasurement={props.totalVoltage10}
                    />
                </div>
                <div className={styles.batteryRow}>
                    <BatteryPack
                        stateOfChargeMeasurement={props.SOC2}
                        temperatureMeasurement={props.battery_temperature_2}
                        maxCellMeasurement={props.maximumCell2}
                        minCellMeasurement={props.minimumCell2}
                        voltageMeasurement={props.totalVoltage2}
                    />
                    <div className={styles.centerPiece}>
                        <BatteryConnector rotate />
                        <BatteryConnector />
                    </div>
                    <BatteryPack
                        stateOfChargeMeasurement={props.SOC9}
                        temperatureMeasurement={props.battery_temperature_9}
                        maxCellMeasurement={props.maximumCell9}
                        minCellMeasurement={props.minimumCell9}
                        voltageMeasurement={props.totalVoltage9}
                    />
                </div>
                <div className={styles.batteryRow}>
                    <BatteryPack
                        stateOfChargeMeasurement={props.SOC3}
                        temperatureMeasurement={props.battery_temperature_3}
                        maxCellMeasurement={props.maximumCell3}
                        minCellMeasurement={props.minimumCell3}
                        voltageMeasurement={props.totalVoltage3}
                    />
                    <div className={styles.centerPiece}>
                        <BatteryConnector rotate />
                        <BatteryConnector />
                    </div>
                    <BatteryPack
                        stateOfChargeMeasurement={props.SOC8}
                        temperatureMeasurement={props.battery_temperature_8}
                        maxCellMeasurement={props.maximumCell8}
                        minCellMeasurement={props.minimumCell8}
                        voltageMeasurement={props.totalVoltage8}
                    />
                </div>
                <div className={styles.batteryRow}>
                    <BatteryPack
                        stateOfChargeMeasurement={props.SOC4}
                        temperatureMeasurement={props.battery_temperature_4}
                        maxCellMeasurement={props.maximumCell4}
                        minCellMeasurement={props.minimumCell4}
                        voltageMeasurement={props.totalVoltage4}
                    />
                    <div className={styles.centerPiece}>
                        <BatteryConnector rotate />
                        <BatteryConnector />
                    </div>
                    <BatteryPack
                        stateOfChargeMeasurement={props.SOC7}
                        temperatureMeasurement={props.battery_temperature_7}
                        maxCellMeasurement={props.maximumCell7}
                        minCellMeasurement={props.minimumCell7}
                        voltageMeasurement={props.totalVoltage7}
                    />
                </div>
                <div className={styles.batteryRow}>
                    <BatteryPack
                        stateOfChargeMeasurement={props.SOC5}
                        temperatureMeasurement={props.battery_temperature_5}
                        maxCellMeasurement={props.maximumCell5}
                        minCellMeasurement={props.minimumCell5}
                        voltageMeasurement={props.totalVoltage5}
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
                        stateOfChargeMeasurement={props.SOC6}
                        temperatureMeasurement={props.battery_temperature_6}
                        maxCellMeasurement={props.maximumCell6}
                        minCellMeasurement={props.minimumCell6}
                        voltageMeasurement={props.totalVoltage6}
                    />
                </div>
            </div>
        </Window>
    );
};
