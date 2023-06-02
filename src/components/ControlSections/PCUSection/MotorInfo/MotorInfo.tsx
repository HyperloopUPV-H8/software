import styles from "./MotorInfo.module.scss";
import { NumericMeasurement } from "common";
import { ColorfulChart } from "components/ColorfulChart/ColorfulChart";

type Props = {
    motorCurrentU: NumericMeasurement;
    motorCurrentV: NumericMeasurement;
    motorCurrentW: NumericMeasurement;
    motorTemperature: NumericMeasurement;
};

export const MotorInfo = ({
    motorCurrentU,
    motorCurrentV,
    motorCurrentW,
    motorTemperature,
}: Props) => {
    return (
        <div className={styles.motorInfoWrapper}>
            <ColorfulChart
                title="Motor"
                length={100}
                measurements={[motorCurrentU, motorCurrentV, motorCurrentW]}
            />
        </div>
    );
};
