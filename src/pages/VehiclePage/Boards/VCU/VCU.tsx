import styles from "./VCU.module.scss";
import { Window } from "components/Window/Window";
import { VcuMeasurements } from "common";
import { BarTag } from "components/BarTag/BarTag";
import { ValueDataTag } from "components/ValueDataTag/ValueDataTag";

export const VCU = (props: VcuMeasurements) => {
    return (
        <Window title="VCU">
            <div className={styles.vcu}>
                <ValueDataTag measurement={props.valve_state} />
                <ValueDataTag measurement={props.reed_state} />
                <BarTag
                    barType="range"
                    measurement={props.high_pressure}
                />
            </div>
        </Window>
    );
};
