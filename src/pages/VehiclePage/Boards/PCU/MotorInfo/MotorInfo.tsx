import styles from "./MotorInfo.module.scss";
import { NumericMeasurement, isNumericMeasurement } from "common";
import { ColorfulChart } from "common";
import { store } from "store";

type Props = {
    motorCurrentU: NumericMeasurement;
    motorCurrentV: NumericMeasurement;
    motorCurrentW: NumericMeasurement;
    motorTemperature: NumericMeasurement;
};

export const MotorInfo = ({ motorCurrentU }: Props) => {
    return (
        <div className={styles.motorInfoWrapper}>
            <ColorfulChart
                className={styles.chart}
                title="Motor"
                length={100}
                items={[
                    {
                        id: motorCurrentU.id,
                        name: motorCurrentU.name,
                        color: "red",
                        getUpdate: () => {
                            const measurement =
                                store.getState().measurements.measurements[
                                    motorCurrentU.id
                                ];

                            if (!measurement) {
                                return 0;
                            }

                            if (isNumericMeasurement(measurement)) {
                                return measurement.value.last;
                            } else {
                                return 0;
                            }
                        },
                        range: motorCurrentU.safeRange,
                    },
                ]}
            />
        </div>
    );
};
