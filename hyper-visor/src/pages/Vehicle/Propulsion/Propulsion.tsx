import styles from "./Propulsion.module.scss";
import { Title } from "components/Title/Title";
import { Text } from "components/Text/Text";
import { ColorfulChart, useMeasurementsStore } from "common";
import { DoubleGauge } from "components/DoubleGauge/DoubleGauge";
import { getLines } from "../getLines";

export const Propulsion = () => {
    const measurements  = useMeasurementsStore(state => state.measurements);
    const getNumericMeasurementInfo = useMeasurementsStore(state => state.getNumericMeasurementInfo)

    return (
        <div className={styles.propulsion}>
            <Title title="Propulsion ON" />
            <DoubleGauge
                firstGauge={getNumericMeasurementInfo("PCU/velocity")}
                secondGauge={getNumericMeasurementInfo("PCU/accel")}
            />
            <Text text="These are the currents inside the vehicle's motor. Together, they propulse Kénos." />
            <ColorfulChart
                className={styles.chart}
                title="Motor 1"
                length={100}
                items={getLines(measurements, [
                    "PCU/motor_a_current_u",
                    "PCU/motor_a_current_v",
                    "PCU/motor_a_current_w",
                ])}
            ></ColorfulChart>
            <ColorfulChart
                className={styles.chart}
                title="Motor 2"
                length={100}
                items={getLines(measurements, [
                    "motor_b_current_u",
                    "motor_b_current_v",
                    "motor_b_current_w",
                ])}
            ></ColorfulChart>
        </div>
    );
};
