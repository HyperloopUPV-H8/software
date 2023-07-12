import { ValueData } from "components/ValueData/ValueData";
import styles from "./BMSL.module.scss";
import { BooleanMeasurement, NumericMeasurement } from "common";
import { BarTag } from "components/BarTag/BarTag";
import { BmslMeasurements } from "./selector";
import { Window } from "components/Window/Window";

export const BMSL = (props: BmslMeasurements) => {
    return (
        <Window title="BMSL">
            <div className={styles.bmsl}>
                <ValueData measurement={props.stateOfCharge} />
                <ValueData measurement={props.balancing} />
                <BarTag
                    barType="temp"
                    measurement={props.temp1}
                />
                <BarTag
                    barType="temp"
                    measurement={props.temp2}
                />
                <ValueData measurement={props.totalVoltage} />
                <ValueData measurement={props.minimumVoltage} />
                <ValueData measurement={props.maximumVoltage} />
            </div>
        </Window>
    );
};
