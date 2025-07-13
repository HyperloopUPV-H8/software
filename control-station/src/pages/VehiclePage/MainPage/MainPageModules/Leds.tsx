import { HvscuMeasurements, useGlobalTicker, useMeasurementsStore } from "common";
import { useContext, useState } from "react";
import { LostConnectionContext } from "services/connections";
import styles from '../MainPage.module.scss';
import { useEffect } from 'react';

export const LEDS = () => {
    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
    const lostConnection = useContext(LostConnectionContext);
    const voltage = getNumericMeasurementInfo(
        HvscuMeasurements.VoltageReading
    );

    const [VoltageValue, setValueState] = useState<number>(0);
    useGlobalTicker(() => {
        setValueState(voltage.getUpdate);
    });


    const [blink, setBlink] = useState(true);
    useEffect(() => {
        if (lostConnection) return;
        const interval = setInterval(() => {
            setBlink((b) => !b);
        }, 500);
        return () => clearInterval(interval);
    }, [lostConnection]);

    const bgColor = lostConnection
        ? '#cccccc'
        : VoltageValue < 60
            ? ('#9BF37C')
            : (blink ? 'red' : 'white');

    return (
        <div className={styles.leds} style={{ backgroundColor: bgColor }} />
    );
}