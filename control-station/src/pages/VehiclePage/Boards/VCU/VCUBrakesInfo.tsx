import styles from "./VCU.module.scss";
import { Window } from "components/Window/Window";
import { useMeasurementsStore, VcuMeasurements } from "common";
import { IndicatorStack } from "components/IndicatorStack/IndicatorStack";
import { BarIndicator } from "components/BarIndicator/BarIndicator";
import thermometerIcon from "assets/svg/thermometer-filled.svg";

export const VCUBrakesInfo = () => {

    const getNumericMeasurementInfo = useMeasurementsStore(state => state.getNumericMeasurementInfo);
    const bottleTemp1 = getNumericMeasurementInfo(VcuMeasurements.bottleTemp1);
    const bottleTemp2 = getNumericMeasurementInfo(VcuMeasurements.bottleTemp2);
    const highPressure = getNumericMeasurementInfo(VcuMeasurements.highPressure);


    return (
        <Window title="VCU">
            <div className={styles.vcu}>
                <IndicatorStack>
                    <BarIndicator
                        title="Bottle Temp"
                        icon={thermometerIcon}
                        getValue={bottleTemp1.getUpdate}
                        safeRangeMin={bottleTemp1.range[0]!!}
                        safeRangeMax={bottleTemp1.range[1]!!}
                        units="ºC"
                    />
                    <BarIndicator
                        title="Bottle Temp"
                        icon={thermometerIcon}
                        getValue={bottleTemp2.getUpdate}
                        safeRangeMin={bottleTemp2.range[0]!!}
                        safeRangeMax={bottleTemp2.range[1]!!}
                        units="ºC"
                    />
                </IndicatorStack>

                <IndicatorStack>
                    <BarIndicator
                        title="High Pressure"
                        icon={thermometerIcon}
                        getValue={highPressure.getUpdate}
                        safeRangeMin={highPressure.range[0]!!}
                        safeRangeMax={highPressure.range[1]!!}
                        units="bar"
                    />
                    <BarIndicator
                        title="High Pressure"
                        icon={thermometerIcon}
                        getValue={highPressure.getUpdate}
                        safeRangeMin={highPressure.range[0]!!}
                        safeRangeMax={highPressure.range[1]!!}
                        units="bar"
                    />
                    <BarIndicator
                        title="High Pressure"
                        icon={thermometerIcon}
                        getValue={highPressure.getUpdate}
                        safeRangeMin={highPressure.range[0]!!}
                        safeRangeMax={highPressure.range[1]!!}
                        units="bar"
                    />
                    <BarIndicator
                        title="High Pressure"
                        icon={thermometerIcon}
                        getValue={highPressure.getUpdate}
                        safeRangeMin={highPressure.range[0]!!}
                        safeRangeMax={highPressure.range[1]!!}
                        units="bar"
                    />
                </IndicatorStack>
            </div>
        </Window>
    );
};
