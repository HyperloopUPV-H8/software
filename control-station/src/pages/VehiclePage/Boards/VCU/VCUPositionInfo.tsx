import styles from "./VCU.module.scss";
import { Window } from "components/Window/Window";
import { VcuMeasurements } from "common";
import { GaugeTag } from "components/GaugeTag/GaugeTag";

export const VCUPositionInfo = (props: VcuMeasurements) => {
    return (
        <Window title="VCU">
            <div className={styles.vcu}>
                <div className={styles.row}>
                    <GaugeTag 
                        measurement={props.speed} 
                        strokeWidth={120}
                        min={props.speed.safeRange[0] || 0}
                        max={props.speed.safeRange[1] || 50}
                    />
                    <GaugeTag 
                        measurement={props.speed}
                        strokeWidth={120}
                        min={props.speed.safeRange[0] || 0}
                        max={props.speed.safeRange[1] || 50}
                    />
                </div>
            </div>
        </Window>
    );
};
