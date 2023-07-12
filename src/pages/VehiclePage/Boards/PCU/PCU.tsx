import styles from "./PCU.module.scss";
import { Window } from "components/Window/Window";
import { VectorGauge } from "./VectorGauge/VectorGauge";
import { MotorInfo } from "./MotorInfo/MotorInfo";
import { PPUInfo } from "./PPUInfo/PPUInfo";
import { PcuMeasurements } from "common";

export const PCU = (props: PcuMeasurements) => {
    return (
        <Window title="PCU">
            <section className={styles.pcuSectionWrapper}>
                <VectorGauge
                    x={props.vel_x}
                    y={props.vel_y}
                    z={props.vel_z}
                />
                <VectorGauge
                    x={props.acc_x}
                    y={props.acc_y}
                    z={props.acc_z}
                />
                <MotorInfo
                    title="Motor 1"
                    motorCurrentU={props.motor_1_current_u}
                    motorCurrentV={props.motor_1_current_v}
                    motorCurrentW={props.motor_1_current_w}
                    motorTemperature={props.motor_1_temp}
                />
                <MotorInfo
                    title="Motor 2"
                    motorCurrentU={props.motor_2_current_u}
                    motorCurrentV={props.motor_2_current_v}
                    motorCurrentW={props.motor_2_current_w}
                    motorTemperature={props.motor_2_temp}
                />
                <PPUInfo
                    batteryCurrent={props.battery_1_current}
                    batteryVoltage={props.battery_1_voltage}
                    temperature1={props.temp_1}
                    temperature2={props.temp_2}
                    temperature3={props.temp_3}
                />
                <PPUInfo
                    batteryCurrent={props.battery_2_current}
                    batteryVoltage={props.battery_2_voltage}
                    temperature1={props.temp_1}
                    temperature2={props.temp_2}
                    temperature3={props.temp_3}
                />
            </section>
        </Window>
    );
};
