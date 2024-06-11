import styles from "./VCU.module.scss";
import { Window } from "components/Window/Window";
import { VcuMeasurements } from "common";
import { IndicatorStack } from "components/IndicatorStack/IndicatorStack";
import { BarIndicator } from "components/BarIndicator/BarIndicator";
import thermometerIcon from "assets/svg/thermometer-filled.svg";

export const VCUBrakesInfo = (props: VcuMeasurements) => {
    return (
        <Window title="VCU">
            <div className={styles.vcu}>
                <IndicatorStack>
                    <BarIndicator measurement={props.bottle_temp_1} title="Bottle Temp" icon={thermometerIcon} units="ºC"/>
                    <BarIndicator measurement={props.bottle_temp_2} title="Bottle Temp" icon={thermometerIcon} units="ºC"/>
                </IndicatorStack>

                <IndicatorStack>
                    <BarIndicator measurement={props.high_pressure} title="High Pressure" icon={thermometerIcon}/>
                    <BarIndicator measurement={props.high_pressure} title="TODO" icon={thermometerIcon}/>
                    <BarIndicator measurement={props.high_pressure} title="TODO" icon={thermometerIcon}/>
                    <BarIndicator measurement={props.high_pressure} title="TODO" icon={thermometerIcon}/>
                </IndicatorStack>
            </div>
        </Window>
    );
};
