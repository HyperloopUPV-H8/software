import styles from "./BoardsPage.module.scss";
import { OBCCUBatteries } from "../Boards/OBCCU/OBCCUBatteries";
import {
    useMeasurementsStore,
    useSubscribe,
} from "common";
import { OBCCUGeneralInfo } from "../Boards/OBCCU/OBCCUGeneralInfo";

export const BoardsPage = () => {
    const updateMeasurements = useMeasurementsStore(state => state.updateMeasurements);

    useSubscribe("podData/update", (msg) => {
        updateMeasurements(msg);
    });

    return (
        <div className={styles.boardsPage}>
            <OBCCUBatteries />
            <div className={styles.column}>
                <OBCCUGeneralInfo />
                {/* <BMSL {...selectBmslMeasurements(measurements)} /> */}
            </div>
            {/* <VCUPositionInfo {...selectVcuMeasurements(measurements)} />
            <VCUBrakesInfo {...selectVcuMeasurements(measurements)} /> */}
        </div>
    );
};
