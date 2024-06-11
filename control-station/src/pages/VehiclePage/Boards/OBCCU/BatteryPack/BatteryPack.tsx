import { BarIndicator } from 'components/BarIndicator/BarIndicator'
import batteryIcon from "assets/svg/battery-filled.svg"
import thermometerIcon from "assets/svg/thermometer-filled.svg"
import thunderIcon from "assets/svg/thunder-filled.svg"
import { Measurement } from 'common'
import styles from "./BatteryPack.module.scss"

interface Props {
    stateOfChargeMeasurement: Measurement;
    temperatureMeasurement: Measurement;
    maxCellMeasurement: Measurement;
    minCellMeasurement: Measurement;
    voltageMeasurement: Measurement;
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
        <div className={styles.container}>
            <BarIndicator
                icon={batteryIcon}
                title="State of Charge"
                measurement={stateOfChargeMeasurement}
                units="%"
            />
            <BarIndicator 
                icon={thermometerIcon}
                title="Temperature"
                measurement={temperatureMeasurement}
                units="ºC"
            />
            <BarIndicator
                icon={thunderIcon}
                title="Max Cell"
                measurement={maxCellMeasurement}
                units="V"
            />
            <BarIndicator
                icon={thunderIcon}
                title="Min Cell"
                measurement={minCellMeasurement}
                units="V"
            />
            <BarIndicator
                icon={thunderIcon}
                title="Voltage"
                measurement={voltageMeasurement}
                units="V"
            />
        </div>
    )
}
