import { BarIndicator } from 'components/BarIndicator/BarIndicator'
import batteryIcon from "assets/svg/battery-filled.svg"
import thermometerIcon from "assets/svg/thermometer-field.svg"
import thunderIcon from "assets/svg/thunder-filled.svg"
import { NumericMeasurement, useMeasurementsStore } from 'common'

interface Props {
    stateOfChargeMeasurement: NumericMeasurement;
    temperatureMeasurement: NumericMeasurement;
    maxCellMeasurement: NumericMeasurement;
    minCellMeasurement: NumericMeasurement;
    voltageMeasurement: NumericMeasurement;
}

export const BatteryPack = (
    {
        stateOfChargeMeasurement,
        temperatureMeasurement,
        maxCellMeasurement,
        minCellMeasurement,
        voltageMeasurement
    }: Props
) => {

    return (
        <div>
            <BarIndicator 
                icon={batteryIcon}
                title="State of Charge"
                measurement={stateOfChargeMeasurement}
            />
            <BarIndicator 
                icon={thermometerIcon}
                title="Temperature"
                measurement={temperatureMeasurement}
            />
            <BarIndicator 
                icon={thunderIcon}
                title="Max Cell"
                measurement={maxCellMeasurement}
            />
            <BarIndicator 
                icon={thunderIcon}
                title="Min Cell"
                measurement={minCellMeasurement}
            />
            <BarIndicator 
                icon={thunderIcon}
                title="Voltage"
                measurement={voltageMeasurement}
            />
        </div>
    )
}
