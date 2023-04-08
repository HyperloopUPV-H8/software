import styles from "./PumpIndicator.module.scss";
import { AnimatedFan } from "./AnimatedFan/AnimatedFan";
import { BooleanBar } from "./BooleanBar/BooleanBar";
import { useState } from "react";

export const PumpIndicator = () => {
    //TODO: sustituir por useSelector cuando el valor este en ADE
    const [isPumpActive, setPumpActive] = useState(true);

    return (
        <div className={styles.pumpIndicatorWrapper}>
            <div className={styles.label}>PUMP</div>
            <AnimatedFan rotate={isPumpActive} />
            <BooleanBar isOn={isPumpActive} />
        </div>
    );
};
