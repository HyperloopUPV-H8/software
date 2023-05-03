import { NumericMeasurement } from "common";
import styles from "./PPUInfo.module.scss";
import { BarTag } from "components/BarTag/BarTag";

type Props = {
    batteryVoltage: NumericMeasurement;
    batteryCurrent: NumericMeasurement;
    temperature1: NumericMeasurement;
    temperature2: NumericMeasurement;
    temperature3: NumericMeasurement;
};

export const PPUInfo = ({
    batteryCurrent,
    batteryVoltage,
    temperature1,
    temperature2,
    temperature3,
}: Props) => {
    return (
        <div className={styles.ppuInfoWrapper}>
            <BarTag
                barType="range"
                measurement={batteryVoltage}
            />
            <BarTag
                barType="range"
                measurement={batteryCurrent}
            />
            <BarTag
                barType="temp"
                measurement={temperature1}
            />
            <BarTag
                barType="temp"
                measurement={temperature2}
            />
            <BarTag
                barType="temp"
                measurement={temperature3}
            />
        </div>
    );
};
