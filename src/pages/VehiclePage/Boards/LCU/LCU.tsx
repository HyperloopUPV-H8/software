import styles from "./LCU.module.scss";
import { Window } from "components/Window/Window";
import { Rotations } from "./Rotations/Rotations";
import { LcuMeasurements } from "common";
import { Airgaps } from "./Airgaps/Airgaps";
import { CoilsInfo } from "./CoilsInfo/CoilsInfo";

type Props = {
    data: LcuMeasurements;
};

export const LCU = ({ data }: Props) => {
    return (
        <Window title="LCU">
            <section className={styles.levitationSectionWrapper}>
                <Rotations
                    className={styles.rotations}
                    rot1={data.rot_x}
                    rot2={data.rot_y}
                    rot3={data.rot_z}
                />
                <Airgaps
                    className={styles.airgaps}
                    airgap_1={data.airgap_1}
                    airgap_2={data.airgap_2}
                    airgap_3={data.airgap_3}
                    airgap_4={data.airgap_4}
                    slave_airgap_5={data.slave_airgap_5}
                    slave_airgap_6={data.slave_airgap_6}
                    slave_airgap_7={data.slave_airgap_7}
                    slave_airgap_8={data.slave_airgap_8}
                />

                <CoilsInfo
                    className={styles.coils}
                    coilsData={[
                        {
                            current: data.current_coil_1,
                            currentRef: data.reference_current_1,
                            temperature: data.temperature_coil_1,
                        },
                        {
                            current: data.current_coil_2,
                            currentRef: data.reference_current_2,
                            temperature: data.temperature_coil_2,
                        },
                        {
                            current: data.current_coil_3,
                            currentRef: data.reference_current_3,
                            temperature: data.temperature_coil_3,
                        },
                        {
                            current: data.current_coil_4,
                            currentRef: data.reference_current_4,
                            temperature: data.temperature_coil_4,
                        },
                        {
                            current: data.slave_current_coil_5,
                            currentRef: data.slave_reference_current_5,
                            temperature: data.slave_temperature_coil_5,
                        },
                        {
                            current: data.slave_current_coil_6,
                            currentRef: data.slave_reference_current_6,
                            temperature: data.slave_temperature_coil_6,
                        },
                        {
                            current: data.slave_current_coil_7,
                            currentRef: data.slave_reference_current_7,
                            temperature: data.slave_temperature_coil_7,
                        },
                        {
                            current: data.slave_current_coil_8,
                            currentRef: data.slave_reference_current_8,
                            temperature: data.slave_temperature_coil_8,
                        },
                    ]}
                />
            </section>
        </Window>
    );
};
