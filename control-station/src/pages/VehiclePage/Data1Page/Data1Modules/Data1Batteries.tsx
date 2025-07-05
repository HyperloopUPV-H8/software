import { Window2 } from 'components/Window/Window2';
import styles from '../Data1Page.module.scss';
import { Gauge } from 'components/GaugeTag/Gauge/Gauge';
import { BatteryIndicator } from 'components/BatteryIndicator/BatteryIndicator';
import { BmslMeasurements, useMeasurementsStore, HvscuMeasurements, HvscuCabinetMeasurements } from "common";

export const Batteries = () => {
    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);

    const CurrentHigh = getNumericMeasurementInfo(HvscuMeasurements.CurrentReading);
    const TotalVoltageHigh = getNumericMeasurementInfo(HvscuMeasurements.BatteriesVoltage);
    const SocHigh = getNumericMeasurementInfo(HvscuMeasurements.BatterySOC);

    const CurrentLow = getNumericMeasurementInfo(BmslMeasurements.current);
    const TotalVoltageLow = getNumericMeasurementInfo(BmslMeasurements.totalVoltage);
    const SocLow = getNumericMeasurementInfo(BmslMeasurements.stateOfCharge);

    const CurrentCabinet = getNumericMeasurementInfo(HvscuCabinetMeasurements.CurrentReading);
    const TotalVoltageCabinet = getNumericMeasurementInfo(HvscuCabinetMeasurements.TotalVoltage);
    const SocCabinet = getNumericMeasurementInfo(HvscuCabinetMeasurements.BatterySOC);

    return (
        <div className={styles.row}>
        <Window2 title="High Voltage" className={styles.voltage}>
            <Gauge id="hv" sweep={180} strokeWidth={15} percentage={75} className="" />
            <BatteryIndicator name={'High Voltage'} getValue={TotalVoltageHigh.getUpdate} 
            safeRangeMin={TotalVoltageHigh.safeRangeMin} warningRangeMin={TotalVoltageHigh.warningRangeMin} 
            safeRangeMax={TotalVoltageHigh.safeRangeMax} warningRangeMax={TotalVoltageHigh.warningRangeMax} />
        </Window2>

        <Window2 title="Low Voltage" className={styles.voltage}>
            <Gauge id="lv" sweep={180} strokeWidth={15} percentage={45} className="" />
            <BatteryIndicator name={'Low Voltage'} getValue={TotalVoltageLow.getUpdate} 
            safeRangeMin={TotalVoltageLow.safeRangeMin} warningRangeMin={TotalVoltageLow.warningRangeMin} 
            safeRangeMax={TotalVoltageLow.safeRangeMax} warningRangeMax={TotalVoltageLow.warningRangeMax} />
        </Window2>

        <Window2 title="BOOSTER" className={styles.voltage}>
            <Gauge id="boost" sweep={180} strokeWidth={15} percentage={55} className="" />
            <BatteryIndicator name={'Cabinet Voltage'} getValue={TotalVoltageCabinet.getUpdate} 
            safeRangeMin={TotalVoltageCabinet.safeRangeMin} warningRangeMin={TotalVoltageCabinet.warningRangeMin} 
            safeRangeMax={TotalVoltageCabinet.safeRangeMax} warningRangeMax={TotalVoltageCabinet.warningRangeMax} />
        </Window2>
    </div>
    );

};