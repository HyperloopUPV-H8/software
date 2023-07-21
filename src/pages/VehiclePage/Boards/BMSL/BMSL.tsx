import { ValueData } from "components/ValueData/ValueData";
import styles from "./BMSL.module.scss";
import { BarTag } from "components/BarTag/BarTag";
import { Window } from "components/Window/Window";
import { BmslMeasurements, NumericMeasurement } from "common";
import { ValueDataTag } from "components/ValueDataTag/ValueDataTag";
import { useSelector } from "react-redux";
import { RootState } from "store";

export const BMSL = (props: BmslMeasurements) => {
    return (
        <Window title="BMSL">
            <div className={styles.bmsl}>
                <ValueDataTag measurement={props.low_SOC1} />
                <BarTag
                    barType="range"
                    measurement={props.low_battery_temperature_1}
                />
                <BarTag
                    barType="range"
                    measurement={props.total_voltage_low}
                />
            </div>
        </Window>
    );
};

function addOffset(
    meas: NumericMeasurement,
    offset: number
): NumericMeasurement {
    return {
        id: meas.id,
        name: meas.name,
        safeRange: meas.safeRange,
        warningRange: meas.safeRange,
        type: meas.type,
        units: meas.units,
        value: {
            average: meas.value.average + offset,
            last: meas.value.last + offset,
        },
    };
}
