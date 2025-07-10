import { Window2 } from 'components/Window/Window2';
import styles from '../MainPage.module.scss';
import { BatteryIndicator } from 'components/BatteryIndicator/BatteryIndicator';
import { BmslMeasurements, useMeasurementsStore, HvscuMeasurements, HvscuCabinetMeasurements } from "common";
import { GaugeTag } from 'components/GaugeTag/GaugeTag';

export const Batteries = () => {
    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);

    const CurrentHV = getNumericMeasurementInfo(HvscuMeasurements.CurrentReading);
    const CurrentLV = getNumericMeasurementInfo(BmslMeasurements.current);
    const CurrentCabinet = getNumericMeasurementInfo(HvscuCabinetMeasurements.CurrentReading);

    const SocHigh = getNumericMeasurementInfo(HvscuMeasurements.BatterySOC);
    const SocLow = getNumericMeasurementInfo(BmslMeasurements.stateOfCharge);
    const SocCabinet = getNumericMeasurementInfo(HvscuCabinetMeasurements.Soc);

    const TotalVoltageHigh = getNumericMeasurementInfo(HvscuMeasurements.BatteriesVoltage);
    const TotalVoltageLow = getNumericMeasurementInfo(BmslMeasurements.totalVoltage);
    const TotalVoltageCabinet = getNumericMeasurementInfo(HvscuCabinetMeasurements.TotalVoltage);

    const BusHV = getNumericMeasurementInfo(HvscuMeasurements.BusVoltage);
    const BusCabinet = getNumericMeasurementInfo(HvscuCabinetMeasurements.BusVoltage);

    return (
        <div className={styles.batteriesRow}>
        <Window2 title="High Voltage">
            <GaugeTag name={'Current'} id={'hv'} units={CurrentHV.units} getUpdate={CurrentHV.getUpdate} strokeWidth={110} min={CurrentHV.range[0] ?? 0} max={CurrentHV.range[1] ?? 100} />
            <BatteryIndicator getValue={TotalVoltageHigh.getUpdate} getValueSOC={SocHigh.getUpdate} color='#ACF293' units={TotalVoltageHigh.units}
                safeRangeMin={TotalVoltageHigh.range[0] ?? 0} warningRangeMin={TotalVoltageHigh.warningRange[0] ?? 100}
                safeRangeMax={TotalVoltageHigh.range[1] ?? 100} warningRangeMax={TotalVoltageHigh.warningRange[1] ?? 70} />
            <GaugeTag name={'DC Bus'} id={'hv-bus'} units={BusHV.units} getUpdate={BusHV.getUpdate} strokeWidth={110} min={BusHV.range[0] ?? 0} max={BusHV.range[1] ?? 100} />
        </Window2>

        <Window2 title="Low Voltage">
            <GaugeTag name={'Current'} id={'lv'} units={CurrentLV.units} getUpdate={CurrentLV.getUpdate} strokeWidth={110} min={CurrentLV.range[0] ?? 0} max={CurrentLV.range[1] ?? 100} />
            <BatteryIndicator getValue={TotalVoltageLow.getUpdate} getValueSOC={SocLow.getUpdate} color='#ACF293' units={TotalVoltageLow.units}
                safeRangeMin={TotalVoltageLow.range[0] ?? 0} warningRangeMin={TotalVoltageLow.warningRange[0] ?? 0}
                safeRangeMax={TotalVoltageLow.range[1] ?? 100} warningRangeMax={TotalVoltageLow.warningRange[1] ?? 70} />
        </Window2>

        <Window2 title="BOOSTER">
            <GaugeTag name={'Current'} id={'cabinet'} units={CurrentCabinet.units} getUpdate={CurrentCabinet.getUpdate} strokeWidth={110} min={CurrentCabinet.range[0] ?? 0} max={CurrentCabinet.range[1] ?? 100} />
            <BatteryIndicator getValue={TotalVoltageCabinet.getUpdate} getValueSOC={SocCabinet.getUpdate} color='#ACF293' units={TotalVoltageCabinet.units}
                safeRangeMin={TotalVoltageCabinet.range[0] ?? 0} warningRangeMin={TotalVoltageCabinet.warningRange[0] ?? 0}
                safeRangeMax={TotalVoltageCabinet.range[1] ?? 100} warningRangeMax={TotalVoltageCabinet.warningRange[1] ?? 70} />
            <GaugeTag name={'DC Bus'} id={'cabinet-bus'} units={BusCabinet.units} getUpdate={BusCabinet.getUpdate} strokeWidth={110} min={BusCabinet.range[0] ?? 0} max={BusCabinet.range[1] ?? 100} />
        </Window2>
    </div>
    );

};