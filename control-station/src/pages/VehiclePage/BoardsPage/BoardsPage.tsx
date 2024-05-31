import styles from "./BoardsPage.module.scss";
import { OBCCUBatteries } from "../Boards/OBCCU/OBCCUBatteries";
import {
    selectObccuMeasurements,
    useMeasurementsStore,
    useSubscribe,
} from "common";
import { OBCCUGeneralInfo } from "../Boards/OBCCU/OBCCUGeneralInfo";

export const BoardsPage = () => {
    const measurements = useMeasurementsStore(state => state.measurements);
    const updateMeasurements = useMeasurementsStore(state => state.updateMeasurements);

    useSubscribe("podData/update", (msg) => {
        updateMeasurements(msg);
    });

    return (
        <div className={styles.boardsPage}>
            <OBCCUBatteries {...selectObccuMeasurements(measurements)} />
            <div className={styles.column}>
                <OBCCUGeneralInfo {...selectObccuMeasurements(measurements)}/>
            </div>
        </div>
    );
};
