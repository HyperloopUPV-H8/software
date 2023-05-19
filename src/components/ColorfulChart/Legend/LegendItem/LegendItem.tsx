import { LineDescription } from "components/Chart/models/ChartData";
import styles from "./LegendItem.module.scss";
import { useTextUpdater } from "services/ImperativeUpdater/useTextUpdater";
import { NumericMeasurement } from "common";

type Props = {
    measurement: NumericMeasurement;
    color: string;
};

export const LegendItem = ({ measurement, color }: Props) => {
    return (
        <div className={styles.legendItem}>
            <div
                className={styles.name}
                style={{ backgroundColor: color }}
            >
                {measurement.name}
            </div>
            <div className={styles.value}>
                <span>{measurement.value.average.toFixed(2)}</span>{" "}
                <span>{measurement.units}</span>
            </div>
        </div>
    );
};
