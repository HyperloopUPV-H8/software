import { ObccuMeasurements } from "common"
import { IndicatorStack } from "components/IndicatorStack/IndicatorStack"
import { StateIndicator } from "components/StateIndicator/StateIndicator"
import { Window } from "components/Window/Window"
import thunderIcon from "assets/svg/thunder-filled.svg"
import batteryIcon from "assets/svg/battery-filled.svg"
import { GaugeTag } from "components/GaugeTag/GaugeTag"
import { BarIndicator } from "components/BarIndicator/BarIndicator"

export const OBCCUGeneralInfo = (props: ObccuMeasurements) => {
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
                        <StateIndicator measurement={props.generalState} icon={thunderIcon} />
                        <StateIndicator measurement={props.generalState} icon={batteryIcon} />
                    </IndicatorStack>

                    <div style={{
                        display: "flex",
                        gap: "1rem",
                    }}>
                        <GaugeTag 
                            measurement={props.totalVoltageHigh}
                            strokeWidth={120}
                            min={0}
                            max={100}
                        />

                        <GaugeTag 
                            measurement={props.totalVoltageHigh}
                            strokeWidth={120}
                            min={0}
                            max={100}
                        />
                    </div>
                </div>
                <div style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    gap: ".5rem",
                    height: "fit-content"
                }}>
                    <StateIndicator measurement={props.generalState} icon={thunderIcon} />

                    <IndicatorStack>
                        <BarIndicator 
                            measurement={props.battery_temperature_1}
                            icon={batteryIcon}
                            title="TODO" 
                            units="ºC"
                        />
                        <BarIndicator 
                            measurement={props.battery_temperature_1} 
                            icon={batteryIcon}
                            title="TODO" 
                            units="ºC"
                        />
                        <BarIndicator 
                            measurement={props.battery_temperature_1} 
                            icon={batteryIcon}
                            title="TODO" 
                            units="ºC"
                        />
                        <BarIndicator 
                            measurement={props.battery_temperature_1} 
                            icon={batteryIcon}
                            title="TODO" 
                            units="ºC"
                        />
                    </IndicatorStack>
                </div>
            </div>
        </Window>
    )
}
