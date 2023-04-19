import styles from "./ViolationView.module.scss";
import { FaultViolation } from "models/AlertMessage";
import { WantView } from "./WantView/WantView";

type Props = {
    violation: FaultViolation;
};

export const ViolationView = ({ violation }: Props) => {
    return (
        <div className={styles.violationViewWrapper}>
            <div className={styles.item}>
                <span className={styles.title}>want:</span>
                <WantView
                    violation={violation}
                    className={styles.value}
                />
            </div>
            <div className={styles.item}>
                <span className={styles.title}>got:</span>
                <span className={styles.value}>{violation.got.toFixed(2)}</span>
            </div>
        </div>
    );
};
