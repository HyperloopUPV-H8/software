import { HvscuMeasurements, useGlobalTicker, useMeasurementsStore } from "common";
import { useContext, useState } from "react";
import { LostConnectionContext } from "services/connections";
import styles from '../Data1Page.module.scss';
import { useEffect } from 'react';

export const PodPosition = () => {
    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
    const lostConnection = useContext(LostConnectionContext);
    const voltage = getNumericMeasurementInfo(
        HvscuMeasurements.VoltageReading
    );

    const [VoltageValue, setValueState] = useState<number>(0);
    useGlobalTicker(() => {
        setValueState(voltage.getUpdate);
    });

    return (
        <div className={styles.leds} style={{ backgroundColor: '#99ccff' }} />
    );
}