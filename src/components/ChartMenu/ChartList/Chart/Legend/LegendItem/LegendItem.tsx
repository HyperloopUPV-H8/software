import styles from "./LegendItem.module.scss";
import { MdClose } from "react-icons/md";
import { NumericMeasurement } from "common";

type Props = {
    name: string;
    value: number;
    units: string;
    color: string;
    removeItem: () => void;
};

export const LegendItem = ({
    name,
    color,
    value,
    units,
    removeItem,
}: Props) => {
    return (
        <div className={styles.legendItemWrapper}>
            <div
                className={styles.lineColor}
                style={{
                    backgroundColor: color,
                }}
            ></div>
            <div className={styles.name}>{name}</div>
            <div className={styles.value}>{value.toFixed(3) + " " + units}</div>
            <MdClose
                className={styles.removeBtn}
                onClick={removeItem}
            />
        </div>
    );
};
