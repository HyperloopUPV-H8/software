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
                safeRangeMin={TotalVoltageHigh.range[0] ?? 0} warningRangeMin={TotalVoltageHigh.warningRange[0] ?? 0}
                safeRangeMax={TotalVoltageHigh.range[1] ?? 0} warningRangeMax={TotalVoltageHigh.warningRange[1] ?? 0} />
        </Window2>

        <Window2 title="Low Voltage" className={styles.voltage}>
            <Gauge id="lv" sweep={180} strokeWidth={15} percentage={45} className="" />
            <BatteryIndicator name={'Low Voltage'} getValue={TotalVoltageLow.getUpdate}
                safeRangeMin={TotalVoltageLow.range[0] ?? 0} warningRangeMin={TotalVoltageLow.warningRange[0] ?? 0}
                safeRangeMax={TotalVoltageLow.range[1] ?? 0} warningRangeMax={TotalVoltageLow.warningRange[1] ?? 0} />
        </Window2>

        <Window2 title="BOOSTER" className={styles.voltage}>
            <Gauge id="boost" sweep={180} strokeWidth={15} percentage={55} className="" />
            <BatteryIndicator name={'Cabinet Voltage'} getValue={TotalVoltageCabinet.getUpdate}
                safeRangeMin={TotalVoltageCabinet.range[0] ?? 0} warningRangeMin={TotalVoltageCabinet.warningRange[0] ?? 0}
                safeRangeMax={TotalVoltageCabinet.range[1] ?? 0} warningRangeMax={TotalVoltageCabinet.warningRange[1] ?? 0} />
        </Window2>
    </div>
    );

};