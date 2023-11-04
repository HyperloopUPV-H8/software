import styles from "./DirectionTag.module.scss";

type Props = {
    axis: string;
    value: number;
    units: string;
};
export const DirectionTag = ({ axis, value, units }: Props) => {
    return (
        <div className={styles.directionTagWrapper}>
            <span className={styles.axis}>{axis}</span>
            <div className={styles.valueWrapper}>
                <span className={styles.value}>{value.toFixed(2)}</span>
                <span className={styles.units}>{units}</span>
            </div>
        </div>
    );
};
