import styles from "./LegendItem.module.scss";

type Props = {
    name: string;
    value: number;
    units: string;
    color: string;
};

export const LegendItem = ({ name, units, value, color }: Props) => {
    return (
        <div className={styles.legendItem}>
            <div
                className={styles.name}
                style={{ backgroundColor: color }}
            >
                {name}
            </div>
            <div className={styles.value}>
                <span>{value.toFixed(2)}</span> <span>{units}</span>
            </div>
        </div>
    );
};
