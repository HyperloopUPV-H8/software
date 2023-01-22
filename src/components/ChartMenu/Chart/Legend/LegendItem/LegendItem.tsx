import styles from "components/ChartMenu/Chart/Legend/LegendItem/LegendItem.module.scss";
import { HSLAColor, hslaToHex, hslaToString } from "utils/color";
import { MdClose } from "react-icons/md";
type Props = {
    data: LegendItemData;
    removeItem: () => void;
};

export type LegendItemData = {
    name: string;
    color: HSLAColor;
};

export const LegendItem = ({ data, removeItem }: Props) => {
    return (
        <div className={styles.wrapper}>
            <div
                className={styles.lineColor}
                style={{
                    backgroundColor: hslaToString(data.color),
                }}
            ></div>
            <div className={styles.name}>{data.name}</div>
            <MdClose className={styles.removeBtn} onClick={removeItem} />
        </div>
    );
};
