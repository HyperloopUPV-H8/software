import styles from "./MotorInfo.module.scss";
import { Measurement } from "common";
import { LinesChart } from "components/LinesChart/LinesChart";

type Props = {
    motorCurrentU: Measurement;
    motorCurrentV: Measurement;
    motorCurrentW: Measurement;
    motorTemperature: Measurement;
};

export const MotorInfo = ({
    motorCurrentU,
    motorCurrentV,
    motorCurrentW,
    motorTemperature,
}: Props) => {
    return (
        <div className={styles.motorInfoWrapper}>
            {/* <LinesChart
                title="Motor 1 Currents"
                measurements={[motorCurrentU, motorCurrentV, motorCurrentW]}
            ></LinesChart> */}
            <div className={styles.motorTemp}>motorTempPlaceholder</div>
        </div>
    );
};
