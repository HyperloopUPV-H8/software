import { ValueData } from "components/ValueData/ValueData";
import styles from "./BMSL.module.scss";
import { BarTag } from "components/BarTag/BarTag";
import { Window } from "components/Window/Window";
import { BmslMeasurements } from "common";
import { ValueDataTag } from "components/ValueDataTag/ValueDataTag";

export const BMSL = (props: BmslMeasurements) => {
    return (
        <Window title="BMSL">
            <div className={styles.bmsl}>
                <ValueDataTag measurement={props.low_SOC1} />
                <BarTag
                    barType="range"
                    measurement={props.low_battery_temperature_1}
                />
                <BarTag
                    barType="range"
                    measurement={props.total_voltage_low}
                />
            </div>
        </Window>
    );
};
