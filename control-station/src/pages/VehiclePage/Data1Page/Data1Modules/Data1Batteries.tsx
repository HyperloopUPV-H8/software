import { Window2 } from 'components/Window/Window2';
import styles from '../Data1Page.module.scss';
import { Gauge } from 'components/GaugeTag/Gauge/Gauge';
import { BatteryIndicator } from 'components/BatteryIndicator/BatteryIndicator';
import { BmslMeasurements, useMeasurementsStore, HvscuMeasurements, HvscuCabinetMeasurements, useGlobalTicker, BcuMeasurements } from "common";
import { useState } from 'react';
import { HVSCU } from 'pages/VehiclePage/Boards/HVSCU/HVSCU';

export const Batteries = () => {
    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
    const TotalVoltageHigh = getNumericMeasurementInfo(HvscuMeasurements.BatteriesVoltage);
    const TotalVoltageLow = getNumericMeasurementInfo(BmslMeasurements.totalVoltage);
    const TotalVoltageCabinet = getNumericMeasurementInfo(HvscuCabinetMeasurements.TotalVoltage);


    return (
        <div className={styles.row}>
        <Window2 title="High Voltage" className={styles.voltage}>
            <Gauge id="hv" sweep={220} strokeWidth={110} measurementId={HvscuMeasurements.CurrentReading} />
            <BatteryIndicator name={'High Voltage'} getValue={TotalVoltageHigh.getUpdate}
                safeRangeMin={TotalVoltageHigh.range[0] ?? 0} warningRangeMin={TotalVoltageHigh.warningRange[0] ?? 0}
                safeRangeMax={TotalVoltageHigh.range[1] ?? 0} warningRangeMax={TotalVoltageHigh.warningRange[1] ?? 0} />
        </Window2>

        <Window2 title="Low Voltage" className={styles.voltage}>
            <Gauge id="lv" sweep={220} strokeWidth={110} measurementId={BmslMeasurements.current} />
            <BatteryIndicator name={'Low Voltage'} getValue={TotalVoltageLow.getUpdate}
                safeRangeMin={TotalVoltageLow.range[0] ?? 0} warningRangeMin={TotalVoltageLow.warningRange[0] ?? 0}
                safeRangeMax={TotalVoltageLow.range[1] ?? 0} warningRangeMax={TotalVoltageLow.warningRange[1] ?? 0} />
        </Window2>

        <Window2 title="BOOSTER" className={styles.voltage}>
            <Gauge id="boost" sweep={220} strokeWidth={110} measurementId={HvscuCabinetMeasurements.CurrentReading} />
            <BatteryIndicator name={'Cabinet Voltage'} getValue={TotalVoltageCabinet.getUpdate}
                safeRangeMin={TotalVoltageCabinet.range[0] ?? 0} warningRangeMin={TotalVoltageCabinet.warningRange[0] ?? 0}
                safeRangeMax={TotalVoltageCabinet.range[1] ?? 0} warningRangeMax={TotalVoltageCabinet.warningRange[1] ?? 0} />
        </Window2>
    </div>
    );

};