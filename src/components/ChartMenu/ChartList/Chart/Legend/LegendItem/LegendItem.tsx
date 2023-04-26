import styles from "./LegendItem.module.scss";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { NumericMeasurement } from "common";
type Props = {
    name: string;
    color: string;
    removeItem: () => void;
};

export const LegendItem = ({ name, color, removeItem }: Props) => {
    const measurement = useSelector(
        (state: RootState) => state.measurements[name]
    );

    return (
        <div className={styles.legendItemWrapper}>
            <div
                className={styles.lineColor}
                style={{
                    backgroundColor: color,
                }}
            ></div>
            <div className={styles.name}>{name}</div>
            {measurement && (
                <div className={styles.value}>
                    {(measurement as NumericMeasurement).value.last.toFixed(3)}
                </div>
            )}
            <MdClose
                className={styles.removeBtn}
                onClick={removeItem}
            />
        </div>
    );
};
