import { Window2 } from 'components/Window/Window2';
import styles from '../Data1Page.module.scss';
import { BatteryIndicator } from 'components/BatteryIndicator/BatteryIndicator';
import { BmslMeasurements, useMeasurementsStore, HvscuMeasurements, HvscuCabinetMeasurements } from "common";
import { GaugeTag } from 'components/GaugeTag/GaugeTag';

export const Batteries = () => {
    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);

    const CurrentHV = getNumericMeasurementInfo(HvscuMeasurements.CurrentReading);
    const CurrentLV = getNumericMeasurementInfo(BmslMeasurements.current);
    const CurrentCabinet = getNumericMeasurementInfo(HvscuCabinetMeasurements.CurrentReading);

    const TotalVoltageHigh = getNumericMeasurementInfo(HvscuMeasurements.BatteriesVoltage);
    const TotalVoltageLow = getNumericMeasurementInfo(BmslMeasurements.totalVoltage);
    const TotalVoltageCabinet = getNumericMeasurementInfo(HvscuCabinetMeasurements.TotalVoltage);


    return (
        <div className={styles.row}>
        <Window2 title="High Voltage">
            <GaugeTag name={'Current'} id={'hv'} units={CurrentHV.units} getUpdate={CurrentHV.getUpdate} strokeWidth={110} min={CurrentHV.range[0] ?? 0} max={CurrentHV.range[1] ?? 100} />
            <BatteryIndicator name={'High Voltage'} getValue={TotalVoltageHigh.getUpdate}
                safeRangeMin={TotalVoltageHigh.range[0] ?? 0} warningRangeMin={TotalVoltageHigh.warningRange[0] ?? 0}
                safeRangeMax={TotalVoltageHigh.range[1] ?? 0} warningRangeMax={TotalVoltageHigh.warningRange[1] ?? 0} />
        </Window2>

        <Window2 title="Low Voltage">
            <GaugeTag name={'Current'} id={'lv'} units={CurrentLV.units} getUpdate={CurrentLV.getUpdate} strokeWidth={110} min={CurrentLV.range[0] ?? 0} max={CurrentLV.range[1] ?? 100} />
            <BatteryIndicator name={'Low Voltage'} getValue={TotalVoltageLow.getUpdate}
                safeRangeMin={TotalVoltageLow.range[0] ?? 0} warningRangeMin={TotalVoltageLow.warningRange[0] ?? 0}
                safeRangeMax={TotalVoltageLow.range[1] ?? 0} warningRangeMax={TotalVoltageLow.warningRange[1] ?? 0} />
        </Window2>

        <Window2 title="BOOSTER">
            <GaugeTag name={'Current'} id={'cabinet'} units={CurrentCabinet.units} getUpdate={CurrentCabinet.getUpdate} strokeWidth={110} min={CurrentCabinet.range[0] ?? 0} max={CurrentCabinet.range[1] ?? 100} />
            <BatteryIndicator name={'Cabinet Voltage'} getValue={TotalVoltageCabinet.getUpdate}
                safeRangeMin={TotalVoltageCabinet.range[0] ?? 0} warningRangeMin={TotalVoltageCabinet.warningRange[0] ?? 0}
                safeRangeMax={TotalVoltageCabinet.range[1] ?? 0} warningRangeMax={TotalVoltageCabinet.warningRange[1] ?? 0} />
        </Window2>
    </div>
    );

};