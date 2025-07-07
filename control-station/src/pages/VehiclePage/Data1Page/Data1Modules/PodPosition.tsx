import { HvscuMeasurements, PcuMeasurements, useGlobalTicker, useMeasurementsStore } from "common";
import { useContext, useState } from "react";
import { LostConnectionContext } from "services/connections";
import styles from '../Data1Page.module.scss';
import { getPercentageFromRange } from "state";

export const PodPosition = () => {
    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
    const lostConnection = useContext(LostConnectionContext);
    const position = getNumericMeasurementInfo(
        PcuMeasurements.podPosition
    );

    const [positionValue, setValueState] = useState<number>(0);
    useGlobalTicker(() => {
        setValueState(position.getUpdate);
    });

    const percent = getPercentageFromRange(positionValue, 0, 50.5);

    return (
        <div
            className={styles.pod}
            style={{
                backgroundColor: lostConnection ? '#cccccc' : '#99ccff',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: `${percent+0.5}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: lostConnection ? '#888' : '#003366',
                    border: '2px solid white',
                    transition: 'left 0.2s',
                }}
            />
        </div>
    );
}