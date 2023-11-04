import { useGlobalTicker } from "common";
import styles from "./LegendItem.module.scss";
import { MdClose } from "react-icons/md";
import { useState } from "react";

type Props = {
    name: string;
    units: string;
    color: string;
    getValue: () => number;
    removeItem: () => void;
};

export const LegendItem = ({
    name,
    color,
    units,
    getValue,
    removeItem,
}: Props) => {
    const [value, setValue] = useState(0);

    useGlobalTicker(() => {
        setValue(getValue());
    });

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
