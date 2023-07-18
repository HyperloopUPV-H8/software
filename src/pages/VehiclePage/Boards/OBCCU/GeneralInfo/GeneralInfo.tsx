import {
    BooleanMeasurement,
    EnumMeasurement,
    GaugeTag,
    NumericMeasurement,
} from "common";
import styles from "./GeneralInfo.module.scss";
import { BarTag } from "components/BarTag/BarTag";
import { ValueDataTag } from "components/ValueDataTag/ValueDataTag";

type Props = {
    maximumCell1: NumericMeasurement;
    maximumCell2: NumericMeasurement;
    maximumCell3: NumericMeasurement;

    minimumCell1: NumericMeasurement;
    minimumCell2: NumericMeasurement;
    minimumCell3: NumericMeasurement;

    totalVoltageHigh: NumericMeasurement;
    drift: NumericMeasurement;
};

export const GeneralInfo = (props: Props) => {
    return (
        <div className={styles.generalInfo}>
            <BarTag
                barType="range"
                measurement={props.maximumCell1}
            />
            <BarTag
                barType="range"
                measurement={props.maximumCell2}
            />
            <BarTag
                barType="range"
                measurement={props.maximumCell3}
            />
            <BarTag
                barType="range"
                measurement={props.minimumCell1}
            />
            <BarTag
                barType="range"
                measurement={props.minimumCell2}
            />
            <BarTag
                barType="range"
                measurement={props.minimumCell3}
            />
            <BarTag
                barType="range"
                measurement={props.totalVoltageHigh}
            />
            <BarTag
                barType="range"
                measurement={props.drift}
            />
        </div>
    );
};
