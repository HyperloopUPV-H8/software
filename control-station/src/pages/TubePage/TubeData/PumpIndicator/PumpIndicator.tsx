import styles from "./PumpIndicator.module.scss";
import { AnimatedFan } from "./AnimatedFan/AnimatedFan";
import { BooleanBar } from "./BooleanBar/BooleanBar";

type Props = {
    isOn: boolean;
};

export const PumpIndicator = ({ isOn }: Props) => {
    return (
        <div className={styles.pumpIndicatorWrapper}>
            <div className={styles.label}>PUMP</div>
            <AnimatedFan rotate={isOn} />
            <BooleanBar isOn={isOn} />
        </div>
    );
};
