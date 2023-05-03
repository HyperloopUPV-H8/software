import styles from "./ChartItem.module.scss";

type Props = {
    name: string;
    value: number;
    color: string;
};

export const ChartItem = ({ name, value, color }: Props) => {
    return (
        <div className={styles.chartItemWrapper}>
            <span
                className={styles.itemName}
                style={{ backgroundColor: color }}
            >
                {name}
            </span>
            <span className={styles.itemValue}>{value}</span>
        </div>
    );
};
