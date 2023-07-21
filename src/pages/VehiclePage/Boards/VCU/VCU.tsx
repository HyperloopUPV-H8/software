import styles from "./VCU.module.scss";
import { Window } from "components/Window/Window";
import { VcuMeasurements } from "common";
import { BarTag } from "components/BarTag/BarTag";
import { ValueDataTag } from "components/ValueDataTag/ValueDataTag";

export const VCU = (props: VcuMeasurements) => {
    return (
        <Window title="VCU">
            <div className={styles.vcu}>
                <ValueDataTag measurement={props.general_state} />
                <ValueDataTag measurement={props.specific_state} />
                <ValueDataTag measurement={props.voltage_state} />
                <ValueDataTag measurement={props.valve_state} />
                <ValueDataTag measurement={props.reed1} />
                <ValueDataTag measurement={props.reed2} />
                <BarTag
                    barType="range"
                    measurement={props.high_pressure}
                />
                <BarTag
                    barType="range"
                    measurement={props.position}
                />
                <BarTag
                    barType="range"
                    measurement={props.speed}
                />
                <BarTag
                    barType="range"
                    measurement={props.reference_pressure}
                />
            </div>
        </Window>
    );
};
