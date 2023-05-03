import styles from "./Legend.module.scss";
import { LegendItem } from "./LegendItem/LegendItem";
import { memo } from "react";
import { LineDescription } from "../LinesChart/line";
type Props = {
    legendItems: Array<{ id: string; color: string }>;
    removeItem: (id: string) => void;
};

const Legend = ({ legendItems, removeItem }: Props) => {
    return (
        <div className={styles.legendWrapper}>
            {legendItems.map(({ id, color }) => {
                return (
                    <LegendItem
                        key={id}
                        name={id}
                        color={color}
                        removeItem={() => {
                            removeItem(id);
                        }}
                    />
                );
            })}
        </div>
    );
};

export default memo(Legend);
