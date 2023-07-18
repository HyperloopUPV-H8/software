import styles from "./EmergencyButton.module.scss";
import { useListenKey } from "common";

type Props = {
    label: string;
    icon: React.ReactNode;
    className: string;
    targetKey: string;
    onTrigger: () => void;
};

export const EmergencyButton = ({
    label,
    icon,
    className,
    targetKey,
    onTrigger,
}: Props) => {
    useListenKey(targetKey, onTrigger, true);

    return (
        <div
            className={`${styles.emergencyButtonWrapper} ${className}`}
            onClick={onTrigger}
        >
            {icon}
            <span className={styles.label}>{label}</span>
        </div>
    );
};
