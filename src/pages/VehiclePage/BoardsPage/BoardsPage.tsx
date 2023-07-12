import styles from "./BoardsPage.module.scss";
import { useMeasurements } from "../useMeasurements";
import { selectLcuMeasurements, selectPcuMeasurements } from "common";
import { LCU } from "../Boards/LCU/LCU";
import { PCU } from "../Boards/PCU/PCU";
import { BMSL } from "../Boards/BMSL/BMSL";
import { selectBmslMeasurements } from "../Boards/BMSL/selector";
import { OBCCU } from "../Boards/OBCCU/OBCCU";
import { selectObccuMeasurements } from "../Boards/OBCCU/selector";
import { VCU } from "../Boards/VCU/VCU";
import { selectVcuMeasurements } from "../Boards/VCU/selector";

export const BoardsPage = () => {
    const measurements = useMeasurements();

    return (
        <div className={styles.boardsPage}>
            <OBCCU {...selectObccuMeasurements(measurements)} />
            <div className={styles.column}>
                <VCU {...selectVcuMeasurements(measurements)} />
                <PCU {...selectPcuMeasurements(measurements)} />
            </div>
            <div className={styles.column}>
                <LCU {...selectLcuMeasurements(measurements)} />
                <BMSL {...selectBmslMeasurements(measurements)} />
            </div>
        </div>
    );
};
