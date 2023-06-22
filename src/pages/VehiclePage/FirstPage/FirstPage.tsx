import styles from "./FirstPage.module.scss";
import { useMeasurements } from "../useMeasurements";
import { selectLcuMeasurements, selectPcuMeasurements } from "common";
import { LCU } from "../Boards/LCU/LCU";
import { PCU } from "../Boards/PCU/PCU";

export const FirstPage = () => {
    const measurements = useMeasurements();

    return (
        <div className={styles.firstPageWrapper}>
            <LCU data={selectLcuMeasurements(measurements)} />
            <PCU data={selectPcuMeasurements(measurements)} />
        </div>
    );
};
