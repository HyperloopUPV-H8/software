import { NumericMeasurement } from "common";
import styles from "./Legend.module.scss";
import { LegendItem } from "./LegendItem/LegendItem";
import { memo } from "react";
import { ChartLine } from "components/ChartMenu/ChartElement";

type Props = {
    items: ChartLine[];
    removeItem: (id: string) => void;
};

const Legend = ({ items, removeItem }: Props) => {
    return (
        <div className={styles.legendWrapper}>
            {items.map(({ id, name, color, getUpdate, units }) => {
                return (
                    <LegendItem
                        key={id} //TODO: change, different measurements can have the same id
                        name={name}
                        value={getUpdate()}
                        units={units}
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
