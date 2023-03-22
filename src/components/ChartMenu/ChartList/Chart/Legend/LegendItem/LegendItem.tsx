import styles from "./LegendItem.module.scss";
import { HSLAColor, hslaToHex, hslaToString } from "utils/color";
import { MdClose } from "react-icons/md";
type Props = {
    name: string;
    color: string;
    removeItem: () => void;
};

export const LegendItem = ({ name, color, removeItem }: Props) => {
    return (
        <div className={styles.legendItemWrapper}>
            <div
                className={styles.lineColor}
                style={{
                    backgroundColor: color,
                }}
            ></div>
            <div className={styles.name}>{name}</div>
            <MdClose
                className={styles.removeBtn}
                onClick={removeItem}
            />
        </div>
    );
};
