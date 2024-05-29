import styles from "./MotorInfo.module.scss";
import {
    LineDescription,
    Measurement,
    MeasurementId,
    NumericMeasurement,
    isNumericMeasurement,
    useMeasurementsStore,
} from "common";
import { ColorfulChart } from "common";

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
    const getMeasurement = useMeasurementsStore((state) => state.getMeasurement);

    return (
        <div className={styles.motorInfoWrapper}>
            <ColorfulChart
                className={styles.chart}
                title={title}
                length={100}
                items={[
                    getItemFromMeasurement(motorCurrentU, getMeasurement),
                    getItemFromMeasurement(motorCurrentV, getMeasurement),
                    getItemFromMeasurement(motorCurrentW, getMeasurement),
                ]}
            />
        </div>
    );
};

function getItemFromMeasurement(meas: NumericMeasurement, getMeasurement: (id: MeasurementId) => Measurement): LineDescription {
    return {
        id: meas.id,
        name: meas.name,
        color: "red",
        getUpdate: () => getMeasurementValue(meas.id, getMeasurement),
        range: meas.safeRange,
    };
}

function getMeasurementValue(id: string, getMeasurement: (id: MeasurementId) => Measurement): number {
    const measurement = getMeasurement(id)

    if (!measurement) {
        return 0;
    }

    if (isNumericMeasurement(measurement)) {
        return measurement.value.last;
    } else {
        return 0;
    }
}
