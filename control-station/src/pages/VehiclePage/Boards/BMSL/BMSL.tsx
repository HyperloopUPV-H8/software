import styles from "./BMSL.module.scss";
import { Window } from "components/Window/Window";
import { BmslMeasurements, useMeasurementsStore } from "common";
import { GaugeTag } from "components/GaugeTag/GaugeTag";
import { BarIndicator } from "components/BarIndicator/BarIndicator";
import { IndicatorStack } from "components/IndicatorStack/IndicatorStack";
import thermometerIcon from "assets/svg/thermometer-filled.svg";
import batteryIcon from "assets/svg/battery-filled.svg";
import thunderIcon from "assets/svg/thunder-filled.svg";

export const BMSL = () => {
    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
    const totalVoltageLow = getNumericMeasurementInfo(BmslMeasurements.totalVoltageLow);
    const avCurrent = getNumericMeasurementInfo(BmslMeasurements.avCurrent);
    const lowSOC1 = getNumericMeasurementInfo(BmslMeasurements.lowSOC1);
    const lowBatteryTemperature1 = getNumericMeasurementInfo(BmslMeasurements.lowBatteryTemperature1);
    const lowBatteryTemperature2 = getNumericMeasurementInfo(BmslMeasurements.lowBatteryTemperature2);
    const inputChargingCurrent = getNumericMeasurementInfo(BmslMeasurements.inputChargingCurrent);
    const inputChargingVoltage = getNumericMeasurementInfo(BmslMeasurements.inputChargingVoltage);
    const outputChargingCurrent = getNumericMeasurementInfo(BmslMeasurements.outputChargingCurrent);
    const outputChargingVoltage = getNumericMeasurementInfo(BmslMeasurements.outputChargingVoltage);
    const lowCell1 = getNumericMeasurementInfo(BmslMeasurements.lowCell1);
    const lowCell2 = getNumericMeasurementInfo(BmslMeasurements.lowCell2);
    const lowCell3 = getNumericMeasurementInfo(BmslMeasurements.lowCell3);
    const lowCell4 = getNumericMeasurementInfo(BmslMeasurements.lowCell4);
    const lowCell5 = getNumericMeasurementInfo(BmslMeasurements.lowCell5);
    const lowCell6 = getNumericMeasurementInfo(BmslMeasurements.lowCell6);

    return (
        <Window title="BMSL">
            <div className={styles.bmsl}>
                <div className={styles.row}>
                    <GaugeTag
                        name={totalVoltageLow.name}
                        units={totalVoltageLow.units}
                        getUpdate={totalVoltageLow.getUpdate}
                        strokeWidth={120}
                        min={totalVoltageLow.range[0] || 0}
                        max={totalVoltageLow.range[1] || 0}
                    />
                    <GaugeTag
                        name={avCurrent.name}
                        units={avCurrent.units}
                        getUpdate={avCurrent.getUpdate}
                        strokeWidth={120}
                        min={avCurrent.range[1] || 0}
                        max={avCurrent.range[1] || 0}
                    />
                </div>
                <div className={styles.row}>
                    <IndicatorStack>
                        <BarIndicator
                            title="SoC"
                            icon={batteryIcon}
                            getValue={lowSOC1.getUpdate}
                            safeRangeMin={lowSOC1.range[0]!!}
                            safeRangeMax={lowSOC1.range[1]!!}
                            units="%"
                        />
                    </IndicatorStack>

                    <IndicatorStack>
                        <BarIndicator
                            title="Temperature 1"
                            icon={thermometerIcon}
                            getValue={lowBatteryTemperature1.getUpdate}
                            safeRangeMin={lowBatteryTemperature1.range[0]!!}
                            safeRangeMax={lowBatteryTemperature1.range[1]!!}
                            units="ºC"
                        />
                        <BarIndicator
                            title="Temperature 2"
                            icon={thermometerIcon}
                            getValue={lowBatteryTemperature2.getUpdate}
                            safeRangeMin={lowBatteryTemperature2.range[0]!!}
                            safeRangeMax={lowBatteryTemperature2.range[1]!!}
                            units="ºC"
                        />
                    </IndicatorStack>
                </div>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <IndicatorStack>
                            <BarIndicator
                                title="Input Current"
                                icon={thunderIcon}
                                getValue={inputChargingCurrent.getUpdate}
                                safeRangeMin={inputChargingCurrent.range[0]!!}
                                safeRangeMax={inputChargingCurrent.range[1]!!}
                                units="A"
                            />
                            <BarIndicator
                                title="Input Voltage"
                                icon={thunderIcon}
                                getValue={inputChargingVoltage.getUpdate}
                                safeRangeMin={inputChargingVoltage.range[0]!!}
                                safeRangeMax={inputChargingVoltage.range[1]!!}
                                units="V"
                            />
                        </IndicatorStack>
                        <IndicatorStack>
                            <BarIndicator
                                title="Output Current"
                                icon={thunderIcon}
                                getValue={outputChargingCurrent.getUpdate}
                                safeRangeMin={outputChargingCurrent.range[0]!!}
                                safeRangeMax={outputChargingCurrent.range[1]!!}
                                units="A"
                            />
                            <BarIndicator
                                title="Output Voltage"
                                icon={thunderIcon}
                                getValue={outputChargingVoltage.getUpdate}
                                safeRangeMin={outputChargingVoltage.range[0]!!}
                                safeRangeMax={outputChargingVoltage.range[1]!!}
                                units="V"
                            />
                        </IndicatorStack>
                    </div>
                    <div className={styles.column}>
                        <IndicatorStack>
                            <BarIndicator
                                title="Cell 1"
                                icon={batteryIcon}
                                getValue={lowCell1.getUpdate}
                                safeRangeMin={lowCell1.range[0]!!}
                                safeRangeMax={lowCell1.range[1]!!}
                                units="V"
                            />
                            <BarIndicator
                                title="Cell 2"
                                icon={batteryIcon}
                                getValue={lowCell2.getUpdate}
                                safeRangeMin={lowCell2.range[0]!!}
                                safeRangeMax={lowCell2.range[1]!!}
                                units="V"
                            />
                            <BarIndicator
                                title="Cell 3"
                                icon={batteryIcon}
                                getValue={lowCell3.getUpdate}
                                safeRangeMin={lowCell3.range[0]!!}
                                safeRangeMax={lowCell3.range[1]!!}
                                units="V"
                            />
                            <BarIndicator
                                title="Cell 4"
                                icon={batteryIcon}
                                getValue={lowCell4.getUpdate}
                                safeRangeMin={lowCell4.range[0]!!}
                                safeRangeMax={lowCell4.range[1]!!}
                                units="V"
                            />
                            <BarIndicator
                                title="Cell 5"
                                icon={batteryIcon}
                                getValue={lowCell5.getUpdate}
                                safeRangeMin={lowCell5.range[0]!!}
                                safeRangeMax={lowCell5.range[1]!!}
                                units="V"
                            />
                            <BarIndicator
                                title="Cell 6"
                                icon={batteryIcon}
                                getValue={lowCell6.getUpdate}
                                safeRangeMin={lowCell6.range[0]!!}
                                safeRangeMax={lowCell6.range[1]!!}
                                units="V"
                            />
                        </IndicatorStack>
                    </div>
                </div>
            </div>
        </Window>
    );
};
