import styles from "./PCU.module.scss";
import { Window } from "components/Window/Window";
import { VectorGauge } from "./VectorGauge/VectorGauge";
import { MotorInfo } from "./MotorInfo/MotorInfo";
import { PcuMeasurements } from "common";
import { TempTag } from "./TempTag/TempTag";
import motorUrl from "assets/images/motor.png";
import pcbUrl from "assets/images/pcb.png";
export const PCU = (props: PcuMeasurements) => {
    return (
        <Window title="PCU">
            <section className={styles.pcuSectionWrapper}>
                <VectorGauge
                    x={props.velocity}
                    y={props.velocity}
                    z={props.velocity}
                />
                <VectorGauge
                    x={props.accel_x}
                    y={props.accel_y}
                    z={props.accel_z}
                />
                <MotorInfo
                    title="Motor 1"
                    motorCurrentU={props.motor_a_current_u}
                    motorCurrentV={props.motor_a_current_v}
                    motorCurrentW={props.motor_a_current_w}
                />
                <MotorInfo
                    title="Motor 2"
                    motorCurrentU={props.motor_b_current_u}
                    motorCurrentV={props.motor_b_current_v}
                    motorCurrentW={props.motor_b_current_w}
                />
                <TempTag
                    meas={props.max_motor_a_temperature}
                    icon={
                        <img
                            src={motorUrl}
                            style={{
                                objectFit: "contain",
                                width: "9rem",
                                height: "4rem",
                            }}
                        />
                    }
                />
                <TempTag
                    meas={props.max_ppu_a_temperature}
                    icon={
                        <img
                            src={pcbUrl}
                            style={{
                                objectFit: "contain",
                                width: "4rem",
                                height: "4rem",
                            }}
                        />
                    }
                />
            </section>
        </Window>
    );
};
