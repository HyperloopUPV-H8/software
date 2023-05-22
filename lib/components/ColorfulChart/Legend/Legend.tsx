import styles from "./Legend.module.scss";
import { LegendItem } from "./LegendItem/LegendItem";
import { NumericMeasurement } from "models";

type Props = {
    items: Array<{ measurement: NumericMeasurement; color: string }>;
};

export const Legend = ({ items }: Props) => {
    return (
        <div className={styles.legend}>
            {items.map((item) => {
                return (
                    <LegendItem
                        key={item.measurement.id}
                        measurement={item.measurement}
                        color={item.color}
                    />
                );
            })}
        </div>
    );
};
