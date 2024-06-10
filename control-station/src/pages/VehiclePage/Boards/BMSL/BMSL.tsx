import styles from "./BMSL.module.scss"
import { Window } from "components/Window/Window";
import { BmslMeasurements } from "common";
import { GaugeTag } from "components/GaugeTag/GaugeTag";
import { BarIndicator } from "components/BarIndicator/BarIndicator";
import { IndicatorStack } from "components/IndicatorStack/IndicatorStack";
import thermometerIcon from "assets/svg/thermometer-filled.svg"
import batteryIcon from "assets/svg/battery-filled.svg"
import thunderIcon from "assets/svg/thunder-filled.svg"

export const BMSL = (props: BmslMeasurements) => {
    return (
        <Window title="BMSL">
            <div className={styles.bmsl}>
                <div className={styles.row}>
                    <GaugeTag 
                        measurement={props.total_voltage_low} 
                        strokeWidth={120}
                        min={props.total_voltage_low.safeRange[0] || 0}
                        max={props.total_voltage_low.safeRange[0] || 0}
                    />
                    <GaugeTag 
                        measurement={props.av_current} 
                        strokeWidth={120}
                        min={props.av_current.safeRange[0] || 0}
                        max={props.av_current.safeRange[0] || 0}
                    />
                </div>
                <div className={styles.row}>
                    <IndicatorStack>
                        {/* <StateIndicator measurement={props.}/> */}
                        <BarIndicator measurement={props.low_SOC1} title="SoC" icon={batteryIcon} units="%"/>
                    </IndicatorStack>

                    <IndicatorStack>
                        <BarIndicator measurement={props.low_battery_temperature_1} title="Temperature 1" icon={thermometerIcon} units="ºC"/>
                        <BarIndicator measurement={props.low_battery_temperature_2} title="Temperature 2" icon={thermometerIcon} units="ºC"/>
                    </IndicatorStack>
                </div>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <IndicatorStack>
                            <BarIndicator measurement={props.input_charging_current} title="Input Current" icon={thunderIcon} units="A"/>
                            <BarIndicator measurement={props.input_charging_voltage} title="Input Voltage" icon={thunderIcon} units="V"/>
                        </IndicatorStack>
                        <IndicatorStack>
                            <BarIndicator measurement={props.output_charging_current} title="Output Current" icon={thunderIcon} units="A"/>
                            <BarIndicator measurement={props.output_charging_voltage} title="Output Voltage" icon={thunderIcon} units="V"/>
                        </IndicatorStack>
                    </div>
                    <div className={styles.column}>
                        <IndicatorStack>
                            <BarIndicator measurement={props.low_cell1} title="Cell 1" icon={batteryIcon} units="V"/>
                            <BarIndicator measurement={props.low_cell2} title="Cell 2" icon={batteryIcon} units="V"/>
                            <BarIndicator measurement={props.low_cell3} title="Cell 3" icon={batteryIcon} units="V"/>
                            <BarIndicator measurement={props.low_cell4} title="Cell 4" icon={batteryIcon} units="V"/>
                            <BarIndicator measurement={props.low_cell5} title="Cell 5" icon={batteryIcon} units="V"/>
                            <BarIndicator measurement={props.low_cell6} title="Cell 6" icon={batteryIcon} units="V"/>
                        </IndicatorStack>
                    </div>
                </div>
            </div>
        </Window>
    );
};
