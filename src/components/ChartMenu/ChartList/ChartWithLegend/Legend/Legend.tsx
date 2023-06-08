import { NumericMeasurement } from "common";
import styles from "./Legend.module.scss";
import { LegendItem } from "./LegendItem/LegendItem";
import { memo } from "react";
import { ChartLine } from "components/ChartMenu/ChartElement";

type Props = {
    items: ChartLine[];
    removeItem: (id: string) => void;
    getValue: (id: string) => number;
};

const Legend = ({ items, getValue, removeItem }: Props) => {
    return (
        <div className={styles.legendWrapper}>
            {items.map(({ id, name, color, getUpdate, units }) => {
                return (
                    <LegendItem
                        key={id} //TODO: change, different measurements can have the same id
                        name={name}
                        getValue={() => getValue(id)}
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
