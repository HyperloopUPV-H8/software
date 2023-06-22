import styles from "./BatteryIcon.module.scss";

type Props = {
    percentage: number;
    className: string;
};

export const BatteryIcon = ({ percentage, className }: Props) => {
    return (
        <div className={`${styles.batteryIconWrapper} ${className}`}>
            <div className={styles.terminal}></div>
            <div className={styles.container}>
                <div
                    className={styles.fill}
                    style={{ height: percentage + "%" }}
                ></div>
            </div>
        </div>
    );
};
