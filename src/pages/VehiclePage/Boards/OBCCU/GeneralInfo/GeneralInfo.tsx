import {
    BooleanMeasurement,
    EnumMeasurement,
    GaugeTag,
    NumericMeasurement,
} from "common";
import styles from "./GeneralInfo.module.scss";
import { ValueData } from "components/ValueData/ValueData";
import { BarTag } from "components/BarTag/BarTag";

type Props = {
    chargePercentage: NumericMeasurement;
    generalState: EnumMeasurement;
    chargeCurrent: NumericMeasurement;
    imd: BooleanMeasurement;
    capacitorTemperature: NumericMeasurement;
    inverterTemperature: NumericMeasurement;
    rectifierTemperature: NumericMeasurement;
    transformerTemperature: NumericMeasurement;
};

export const GeneralInfo = (props: Props) => {
    return (
        <div className={styles.generalInfo}>
            <GaugeTag
                max={props.chargePercentage.safeRange[0] ?? 100}
                min={props.chargePercentage.safeRange[0] ?? 0}
                name={props.chargePercentage.name}
                strokeWidth={150}
                units={props.chargePercentage.units}
                value={props.chargePercentage.value.average}
            />
            <div className={styles.tags}>
                <ValueData measurement={props.generalState} />
                <BarTag
                    barType="range"
                    measurement={props.chargeCurrent}
                />
                <BarTag
                    barType="bool"
                    measurement={props.imd}
                />
                <div className={styles.temps}>
                    <BarTag
                        barType="temp"
                        measurement={props.capacitorTemperature}
                    />
                    <BarTag
                        barType="temp"
                        measurement={props.inverterTemperature}
                    />
                    <BarTag
                        barType="temp"
                        measurement={props.rectifierTemperature}
                    />
                    <BarTag
                        barType="temp"
                        measurement={props.transformerTemperature}
                    />
                </div>
            </div>
        </div>
    );
};
