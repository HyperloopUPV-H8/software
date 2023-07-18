import styles from "./BarTag.module.scss";
import { BooleanMeasurement, NumericMeasurement } from "common";
import { Bar } from "./Bar/Bar";
import { ValueData } from "components/ValueData/ValueData";
import { StateOverlay } from "components/StateOverlay/StateOverlay";
import { getState, getStateFromRange } from "state";

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
        <StateOverlay state={getState(measurement)}>
            <article
                className={`${styles.barTagWrapper} ${
                    showWrapper ? styles.tagWrapper : ""
                }`}
            >
                {(barType == "range" || barType == "temp") &&
                    measurement.safeRange[0] !== null &&
                    measurement.safeRange[1] !== null && (
                        <Bar
                            type={barType}
                            value={measurement.value.last}
                            min={measurement.safeRange[0]}
                            max={measurement.safeRange[1]}
                        />
                    )}
                {(barType == "range" || barType == "temp") &&
                    (measurement.safeRange[0] === null ||
                        measurement.safeRange[1] === null) && (
                        <Bar
                            type="bool"
                            value={(() => {
                                const state = getStateFromRange(
                                    measurement.value.last,
                                    measurement.safeRange[0],
                                    measurement.safeRange[1]
                                );

                                if (state == "stable") {
                                    return true;
                                } else {
                                    return false;
                                }
                            })()}
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
        </StateOverlay>
    );
};
