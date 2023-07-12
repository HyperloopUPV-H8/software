import { Window } from "components/Window/Window";
import { BatteryInfo } from "./BatteryInfo/BatteryInfo";
import { GeneralInfo } from "./GeneralInfo/GeneralInfo";
import styles from "./OBCCU.module.scss";
import { ObccuMeasurements } from "./selector";

export const OBCCU = (props: ObccuMeasurements) => {
    return (
        <Window title="OBCCU">
            <div className={styles.obccu}>
                <GeneralInfo
                    {...props}
                    chargePercentage={props["2BatteryTemperature1"]}
                    chargeCurrent={props["2BatteryTemperature1"]}
                />
                <div className={styles.batteries}>
                    <BatteryInfo
                        title="Battery 1"
                        isBalancing={props.isBalancing1}
                        soc={props.SOC1}
                        temp1={props["2BatteryTemperature1"]}
                        temp2={props["2BatteryTemperature1"]}
                        maxCell={props.maximumCell1}
                        minCell={props.minimumCell1}
                        totalVoltage={props.totalVoltage1}
                    />
                    <BatteryInfo
                        title="Battery 1"
                        isBalancing={props.isBalancing1}
                        soc={props.SOC1}
                        temp1={props["2BatteryTemperature1"]}
                        temp2={props["2BatteryTemperature1"]}
                        maxCell={props.maximumCell1}
                        minCell={props.minimumCell1}
                        totalVoltage={props.totalVoltage1}
                    />
                    <BatteryInfo
                        title="Battery 1"
                        isBalancing={props.isBalancing1}
                        soc={props.SOC1}
                        temp1={props["2BatteryTemperature1"]}
                        temp2={props["2BatteryTemperature1"]}
                        maxCell={props.maximumCell1}
                        minCell={props.minimumCell1}
                        totalVoltage={props.totalVoltage1}
                    />
                    <BatteryInfo
                        title="Battery 1"
                        isBalancing={props.isBalancing1}
                        soc={props.SOC1}
                        temp1={props["2BatteryTemperature1"]}
                        temp2={props["2BatteryTemperature1"]}
                        maxCell={props.maximumCell1}
                        minCell={props.minimumCell1}
                        totalVoltage={props.totalVoltage1}
                    />
                    <BatteryInfo
                        title="Battery 1"
                        isBalancing={props.isBalancing1}
                        soc={props.SOC1}
                        temp1={props["2BatteryTemperature1"]}
                        temp2={props["2BatteryTemperature1"]}
                        maxCell={props.maximumCell1}
                        minCell={props.minimumCell1}
                        totalVoltage={props.totalVoltage1}
                    />
                    <BatteryInfo
                        title="Battery 1"
                        isBalancing={props.isBalancing1}
                        soc={props.SOC1}
                        temp1={props["2BatteryTemperature1"]}
                        temp2={props["2BatteryTemperature1"]}
                        maxCell={props.maximumCell1}
                        minCell={props.minimumCell1}
                        totalVoltage={props.totalVoltage1}
                    />
                </div>
            </div>
        </Window>
    );
};
