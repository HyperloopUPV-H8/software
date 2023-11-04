import {
    BooleanMeasurement,
    EnumMeasurement,
    NumericMeasurement,
} from "common";
import styles from "./BatteryInfo.module.scss";
import { ValueData } from "components/ValueData/ValueData";
import { BarTag } from "components/BarTag/BarTag";
import batteryUrl from "assets/images/battery.png";
import { ValueDataTag } from "components/ValueDataTag/ValueDataTag";

type Props = {
    title: string;
    soc: EnumMeasurement;
    temp1: NumericMeasurement;
    totalVoltage: NumericMeasurement;
};

export const BatteryInfo = (props: Props) => {
    return (
        <div className={styles.batteryInfo}>
            {/* <div className={styles.icon}>Image</div> */}
            <img
                className={styles.icon}
                src={batteryUrl}
                alt="Lipo batterty"
            />
            <div className={styles.content}>
                <span className={styles.title}>{props.title}</span>
                <div className={styles.tags}>
                    <ValueDataTag measurement={props.soc} />
                    <BarTag
                        barType="temp"
                        measurement={props.temp1}
                    />
                    <BarTag
                        barType="range"
                        measurement={props.totalVoltage}
                    />
                </div>
            </div>
        </div>
    );
};
