import styles from "./MotorInfo.module.scss";
import {
    LineDescription,
    NumericMeasurement,
    isNumericMeasurement,
} from "common";
import { ColorfulChart } from "common";
import { store } from "store";

type Props = {
    title: string;
    motorCurrentU: NumericMeasurement;
    motorCurrentV: NumericMeasurement;
    motorCurrentW: NumericMeasurement;
};

export const MotorInfo = ({
    title,
    motorCurrentU,
    motorCurrentV,
    motorCurrentW,
}: Props) => {
    return (
        <div className={styles.motorInfoWrapper}>
            <ColorfulChart
                className={styles.chart}
                title={title}
                length={100}
                items={[
                    getItemFromMeasurement(motorCurrentU),
                    getItemFromMeasurement(motorCurrentV),
                    getItemFromMeasurement(motorCurrentW),
                ]}
            />
        </div>
    );
};

function getItemFromMeasurement(meas: NumericMeasurement): LineDescription {
    return {
        id: meas.id,
        name: meas.name,
        color: "red",
        getUpdate: () => getMeasurementValue(meas.id),
        range: meas.safeRange,
    };
}

function getMeasurementValue(id: string): number {
    const measurement = store.getState().measurements.measurements[id];

    if (!measurement) {
        return 0;
    }

    if (isNumericMeasurement(measurement)) {
        return measurement.value.last;
    } else {
        return 0;
    }
}
