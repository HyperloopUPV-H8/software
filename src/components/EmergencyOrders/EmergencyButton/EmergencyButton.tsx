import { lightenHSL } from "colors";
import styles from "./EmergencyButton.module.scss";

type Props = {
    label: string;
    color: string;
    icon: React.ReactNode;
    onClick: () => void;
};

export const EmergencyButton = ({ label, color, icon, onClick }: Props) => {
    return (
        <div
            className={styles.emergencyButtonWrapper}
            style={{ backgroundColor: lightenHSL(color) }}
            onClick={onClick}
        >
            {icon}
            <span
                className={styles.label}
                style={{ color: color }}
            >
                {label}
            </span>
        </div>
    );
};
