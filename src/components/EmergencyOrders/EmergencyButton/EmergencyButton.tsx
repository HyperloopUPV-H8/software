import styles from "./EmergencyButton.module.scss";

type Props = {
    label: string;
    icon: React.ReactNode;
    className: string;
    onClick: () => void;
};

export const EmergencyButton = ({ label, icon, className, onClick }: Props) => {
    return (
        <div
            className={`${styles.emergencyButtonWrapper} ${className}`}
            onClick={onClick}
        >
            {icon}
            <span className={styles.label}>{label}</span>
        </div>
    );
};
