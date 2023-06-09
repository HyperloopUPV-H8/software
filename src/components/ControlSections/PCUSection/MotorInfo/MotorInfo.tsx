import styles from "./MotorInfo.module.scss";
import { NumericMeasurement } from "common";
import { ColorfulChart } from "common";
import { store } from "store";

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
                className={styles.chart}
                title="Motor"
                length={100}
                measurements={[motorCurrentU, motorCurrentV, motorCurrentW]}
                getMeasurement={(id) =>
                    store.getState().measurements[id] as NumericMeasurement
                }
            />
        </div>
    );
};
