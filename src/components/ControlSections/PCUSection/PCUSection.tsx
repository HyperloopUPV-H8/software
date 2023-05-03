import styles from "./PCUSection.module.scss";
import { Window } from "components/Window/Window";
import { VectorGauge } from "./VectorGauge/VectorGauge";
import { MotorInfo } from "./MotorInfo/MotorInfo";
import { PPUInfo } from "./PPUInfo/PPUInfo";
import { PCUData } from "./PCUData";

type Props = {
    data: PCUData;
};

export const PCUSection = ({ data }: Props) => {
    return (
        <Window title="PCU">
            <section className={styles.pcuSectionWrapper}>
                <VectorGauge
                    x={data.vel_x}
                    y={data.vel_y}
                    z={data.vel_z}
                />
                <VectorGauge
                    x={data.acc_x}
                    y={data.acc_y}
                    z={data.acc_z}
                />
                <MotorInfo
                    motorCurrentU={data.motor_1_current_u}
                    motorCurrentV={data.motor_1_current_v}
                    motorCurrentW={data.motor_1_current_w}
                    motorTemperature={data.motor_1_temp}
                />
                <MotorInfo
                    motorCurrentU={data.motor_2_current_u}
                    motorCurrentV={data.motor_2_current_v}
                    motorCurrentW={data.motor_2_current_w}
                    motorTemperature={data.motor_2_temp}
                />
                <PPUInfo
                    batteryCurrent={data.battery_1_current}
                    batteryVoltage={data.battery_1_voltage}
                    temperature1={data.temp_1}
                    temperature2={data.temp_2}
                    temperature3={data.temp_3}
                />
                <PPUInfo
                    batteryCurrent={data.battery_2_current}
                    batteryVoltage={data.battery_2_voltage}
                    temperature1={data.temp_1}
                    temperature2={data.temp_2}
                    temperature3={data.temp_3}
                />
            </section>
        </Window>
    );
};
