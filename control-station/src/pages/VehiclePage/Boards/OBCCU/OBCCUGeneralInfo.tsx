import { ObccuMeasurements, useMeasurementsStore } from "common"
import { IndicatorStack } from "components/IndicatorStack/IndicatorStack"
import { StateIndicator } from "components/StateIndicator/StateIndicator"
import { Window } from "components/Window/Window"
import batteryIcon from "assets/svg/battery-filled.svg"
import thunderIcon from "assets/svg/thunder-filled.svg"
import { GaugeTag } from "components/GaugeTag/GaugeTag"
import { BarIndicator } from "components/BarIndicator/BarIndicator"

export const OBCCUGeneralInfo = () => {
    
    const getNumericMeasurementInfo = useMeasurementsStore(state => state.getNumericMeasurementInfo)
    const totalVoltageHigh = getNumericMeasurementInfo(ObccuMeasurements.totalVoltageHigh)
    const batteryTemperature1 = getNumericMeasurementInfo(ObccuMeasurements.battery_temperature_1)
    
    return (
        <Window title="OBCCU">
            <div style={{
                display: "flex",
                gap: "1rem",
                height: "100%",
            }}
            >
                <div style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    gap: ".5rem",
                }}>
                    <IndicatorStack>
                        <StateIndicator
                            measurementId={ObccuMeasurements.generalState}
                            icon={thunderIcon} 
                        />
                        <StateIndicator 
                            measurementId={ObccuMeasurements.generalState}
                            icon={batteryIcon} 
                        />
                    </IndicatorStack>

                    <div style={{
                        display: "flex",
                        gap: "1rem",
                    }}>
                        <GaugeTag 
                            name={totalVoltageHigh.name}
                            units={totalVoltageHigh.units}
                            getUpdate={totalVoltageHigh.getUpdate}
                            strokeWidth={120}
                            min={totalVoltageHigh.range[0] ?? 0}
                            max={totalVoltageHigh.range[1] ?? 100}
                        />
                        <GaugeTag 
                            name={totalVoltageHigh.name}
                            units={totalVoltageHigh.units}
                            getUpdate={totalVoltageHigh.getUpdate}
                            strokeWidth={120}
                            min={totalVoltageHigh.range[0] ?? 0}
                            max={totalVoltageHigh.range[1] ?? 100}
                        />
                    </div>
                </div>
                <div style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    gap: ".5rem",
                }}>

                    <IndicatorStack>
                        <StateIndicator 
                            measurementId={ObccuMeasurements.generalState} 
                            icon={thunderIcon} 
                        />
                    </IndicatorStack>

                    <IndicatorStack>
                        <BarIndicator
                            icon={batteryIcon}
                            title="TODO"
                            getValue={batteryTemperature1.getUpdate}
                            safeRangeMin={batteryTemperature1.range[0] ?? 0}
                            safeRangeMax={batteryTemperature1.range[1] ?? 100}
                            units="ºC"
                        />
                        <BarIndicator 
                            icon={batteryIcon}
                            title="TODO" 
                            getValue={batteryTemperature1.getUpdate}
                            safeRangeMin={batteryTemperature1.range[0] ?? 0}
                            safeRangeMax={batteryTemperature1.range[1] ?? 100}
                            units="ºC"
                        />
                        <BarIndicator 
                            icon={batteryIcon}
                            title="TODO" 
                            getValue={batteryTemperature1.getUpdate}
                            safeRangeMin={batteryTemperature1.range[0] ?? 0}
                            safeRangeMax={batteryTemperature1.range[1] ?? 100}
                            units="ºC"
                        />
                        <BarIndicator 
                            icon={batteryIcon}
                            title="TODO" 
                            getValue={batteryTemperature1.getUpdate}
                            safeRangeMin={batteryTemperature1.range[0] ?? 0}
                            safeRangeMax={batteryTemperature1.range[1] ?? 100}
                            units="ºC"
                        />
                    </IndicatorStack>
                </div>
            </div>
        </Window>
    )
}
