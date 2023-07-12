import {
    BooleanMeasurement,
    EnumMeasurement,
    NumericMeasurement,
} from "common";
import styles from "./BatteryInfo.module.scss";
import { ValueData } from "components/ValueData/ValueData";
import { BarTag } from "components/BarTag/BarTag";

type Props = {
    title: string;
    soc: EnumMeasurement;
    isBalancing: BooleanMeasurement;
    temp1: NumericMeasurement;
    temp2: NumericMeasurement;
    maxCell: NumericMeasurement;
    minCell: NumericMeasurement;
    totalVoltage: NumericMeasurement;
};

export const BatteryInfo = (props: Props) => {
    return (
        <div className={styles.batteryInfo}>
            <div className={styles.icon}>Image</div>
            <div className={styles.tags}>
                <ValueData measurement={props.soc} />
                <ValueData measurement={props.isBalancing} />
                <BarTag
                    barType="temp"
                    measurement={props.temp1}
                />
                <BarTag
                    barType="temp"
                    measurement={props.temp2}
                />
                <ValueData measurement={props.maxCell} />
                <ValueData measurement={props.minCell} />
                <ValueData measurement={props.totalVoltage} />
            </div>
        </div>
    );
};
