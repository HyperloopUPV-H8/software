import { Window } from "components/Window/Window";
import { BatteryInfo } from "./BatteryInfo/BatteryInfo";
import { GeneralInfo } from "./GeneralInfo/GeneralInfo";
import styles from "./OBCCU.module.scss";
import { ObccuMeasurements } from "common";

export const OBCCU = (props: ObccuMeasurements) => {
    return (
        <Window title="OBCCU">
            <div className={styles.obccu}>
                <GeneralInfo
                    maximumCell1={props.maximumCell1}
                    maximumCell2={props.maximumCell2}
                    maximumCell3={props.maximumCell3}
                    minimumCell1={props.minimumCell1}
                    minimumCell2={props.minimumCell2}
                    minimumCell3={props.minimumCell3}
                    totalVoltageHigh={props.totalVoltageHigh}
                    drift={props["2BatteryTemperature1"]}
                />
                <div className={styles.batteries}>
                    <BatteryInfo
                        title="Battery 1"
                        soc={props.SOC1}
                        temp1={props.battery_temperature_1}
                        totalVoltage={props.totalVoltage1}
                    />
                    <BatteryInfo
                        title="Battery 2"
                        soc={props.SOC1}
                        temp1={props.battery_temperature_2}
                        totalVoltage={props.totalVoltage2}
                    />
                    <BatteryInfo
                        title="Battery 3"
                        soc={props.SOC1}
                        temp1={props.battery_temperature_3}
                        totalVoltage={props.totalVoltage3}
                    />
                </div>
            </div>
        </Window>
    );
};
