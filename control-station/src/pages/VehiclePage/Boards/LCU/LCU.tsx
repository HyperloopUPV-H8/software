import styles from "./LCU.module.scss";
import { Window } from "components/Window/Window";
import { Rotations } from "./Rotations/Rotations";
import { LcuMeasurements } from "common";
import { Airgaps } from "./Airgaps/Airgaps";
import { CoilsInfo } from "./CoilsInfo/CoilsInfo";
import { BarTag } from "components/BarTag/BarTag";

export const LCU = (props: LcuMeasurements) => {
    return (
        <Window title="LCU">
            <section className={styles.levitationSectionWrapper}>
                <Rotations
                    className={styles.rotations}
                    rot1={props.rot_x}
                    rot2={props.rot_y}
                    rot3={props.rot_z}
                />
                <div className={styles.positions}>
                    <BarTag
                        barType="range"
                        measurement={props.rot_y}
                    />
                    <BarTag
                        barType="range"
                        measurement={props.rot_z}
                    />
                </div>
                <Airgaps
                    className={styles.airgaps}
                    airgap_1={props.airgap_1}
                    airgap_2={props.airgap_2}
                    airgap_3={props.airgap_3}
                    airgap_4={props.airgap_4}
                    slave_airgap_5={props.slave_airgap_5}
                    slave_airgap_6={props.slave_airgap_6}
                    slave_airgap_7={props.slave_airgap_7}
                    slave_airgap_8={props.slave_airgap_8}
                />

                <CoilsInfo
                    className={styles.coils}
                    coilsData={[
                        {
                            current: props.current_coil_1,
                            currentRef: props.reference_current_1,
                            temperature: props.temperature_ems_1,
                        },
                        {
                            current: props.current_coil_2,
                            currentRef: props.reference_current_2,
                            temperature: props.temperature_ems_2,
                        },
                        {
                            current: props.current_coil_3,
                            currentRef: props.reference_current_3,
                            temperature: props.temperature_ems_3,
                        },
                        {
                            current: props.current_coil_4,
                            currentRef: props.reference_current_4,
                            temperature: props.temperature_ems_4,
                        },
                        {
                            current: props.slave_current_coil_5,
                            currentRef: props.slave_reference_current_5,
                            temperature: props.temperature_hems_1,
                        },
                        {
                            current: props.slave_current_coil_6,
                            currentRef: props.slave_reference_current_6,
                            temperature: props.temperature_hems_2,
                        },
                        {
                            current: props.slave_current_coil_7,
                            currentRef: props.slave_reference_current_7,
                            temperature: props.temperature_hems_3,
                        },
                        {
                            current: props.slave_current_coil_8,
                            currentRef: props.slave_reference_current_8,
                            temperature: props.temperature_hems_4,
                        },
                    ]}
                />
            </section>
        </Window>
    );
};
