import { BcuMeasurements, ColorfulChart, PcuMeasurements, useMeasurementsStore } from "common";
import { useContext } from "react";
import { LostConnectionContext } from "services/connections";
import styles from '../Data1Page.module.scss';
import { Window } from 'components/Window/Window';


export const ChartDLIM = () => {
    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
    const lostConnection = useContext(LostConnectionContext);
    const DLIMcurrentU = getNumericMeasurementInfo(
        PcuMeasurements.motorACurrentU
    );
    const DLIMcurrentV = getNumericMeasurementInfo(
        PcuMeasurements.motorACurrentV
    );
    const DLIMcurrentW = getNumericMeasurementInfo(
        PcuMeasurements.motorACurrentW
    );

    return (
    <Window title='DLIM'>
        <div className={styles.current_chart}>
            <ColorfulChart
                className={styles.chart}
                length={35}
                items={[
                    lostConnection
                        ? {
                                ...DLIMcurrentU,
                                getUpdate: () => 0,
                            }
                        : DLIMcurrentU,
                    lostConnection
                        ? {
                                ...DLIMcurrentV,
                                getUpdate: () => 0,
                            }
                        : DLIMcurrentV,
                    lostConnection
                        ? {
                                ...DLIMcurrentW,
                                getUpdate: () => 0,
                            }
                        : DLIMcurrentW,
                ]}
            />
        </div>

    </Window>
    );
    

};

export const ChartLSM = () => {
    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
    const lostConnection = useContext(LostConnectionContext);
    const LSMaverageCurrentU = getNumericMeasurementInfo(
        BcuMeasurements.averageCurrentU
    );
    const LSMaverageCurrentV = getNumericMeasurementInfo(
        BcuMeasurements.averageCurrentV
    );
    const LSMaverageCurrentW = getNumericMeasurementInfo(
        BcuMeasurements.averageCurrentW
    );


    return (
    <Window title='LSM'>
        <div className={styles.current_chart}>
            <ColorfulChart
                className={styles.chart}
                length={35}
                items={[
                    lostConnection
                        ? {
                                ...LSMaverageCurrentU,
                                getUpdate: () => 0,
                            }
                        : LSMaverageCurrentU,
                    lostConnection
                        ? {
                                ...LSMaverageCurrentV,
                                getUpdate: () => 0,
                            }
                        : LSMaverageCurrentV,
                    lostConnection
                        ? {
                                ...LSMaverageCurrentW,
                                getUpdate: () => 0,
                            }
                        : LSMaverageCurrentW,
                ]}  
            />
        </div>

    </Window>
    );
};