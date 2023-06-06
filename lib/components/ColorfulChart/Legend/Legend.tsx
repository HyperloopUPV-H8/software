import styles from "./Legend.module.scss";
import { LegendItem } from "./LegendItem/LegendItem";
import { LineDescription } from "../../LinesChart/types";

type Props = {
    items: Array<LineDescription>;
};

export const Legend = ({ items }: Props) => {
    return (
        <div className={styles.legend}>
            {items.map((item) => {
                return (
                    <LegendItem
                        key={item.id}
                        name={item.id}
                        units={"A"}
                        value={item.getUpdate()}
                        color={item.color}
                    />
                );
            })}
        </div>
    );
};
