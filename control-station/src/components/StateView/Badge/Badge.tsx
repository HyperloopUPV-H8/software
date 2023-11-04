import styles from "./Badge.module.scss";
import { lightenHSL } from "colors";
type Props = {
    label: string;
    color: string;
};

export const Badge = ({ label, color }: Props) => {
    return (
        <div
            className={styles.badgeWrapper}
            style={{ backgroundColor: lightenHSL(color) }}
        >
            <span
                className={styles.text}
                style={{ color: color }}
            >
                {label}
            </span>
        </div>
    );
};
