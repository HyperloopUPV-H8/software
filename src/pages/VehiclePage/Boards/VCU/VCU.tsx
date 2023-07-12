import { ValueData } from "components/ValueData/ValueData";
import styles from "./VCU.module.scss";
import { VcuMeasurements } from "./selector";
import { Window } from "components/Window/Window";

export const VCU = (props: VcuMeasurements) => {
    return (
        <Window title="VCU">
            <div className={styles.vcu}>
                <div className={styles.states}>Hello</div>
                <div className={styles.states}>Hello</div>
                <div className={styles.states}>Hello</div>
                <div className={styles.states}>Hello</div>
                <div className={styles.states}>Hello</div>
                <div className={styles.states}>Hello</div>
                <div className={styles.states}>Hello</div>
                <div className={styles.states}>Hello</div>
                <div className={styles.states}>Hello</div>
                <div className={styles.states}>Hello</div>
                <div className={styles.states}>Hello</div>
            </div>
        </Window>
    );
};
