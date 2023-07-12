import styles from "./BarTag.module.scss";
import { BooleanMeasurement, NumericMeasurement } from "common";
import { Bar } from "./Bar/Bar";
import { ValueData } from "components/ValueData/ValueData";

type Props =
    | {
          measurement: NumericMeasurement;
          barType: "range" | "temp";
          showWrapper?: boolean;
      }
    | {
          measurement: BooleanMeasurement;
          barType: "bool";
          showWrapper?: boolean;
      };

export const BarTag = ({
    measurement,
    barType,
    showWrapper = false,
}: Props) => {
    return (
        <article
            className={`${styles.barTagWrapper} ${
                showWrapper ? "tagWrapper" : ""
            }`}
        >
            {(barType == "range" || barType == "temp") && (
                <Bar
                    type={barType}
                    value={measurement.value.average}
                    max={100}
                    min={0}
                />
            )}
            {barType == "bool" && (
                <Bar
                    type={barType}
                    value={measurement.value}
                />
            )}
            <ValueData measurement={measurement} />
        </article>
    );
};
