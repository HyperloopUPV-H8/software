import styles from "./FirstPage.module.scss";
import { extractLevitationData } from "components/ControlSections/LevitationSection/extractLevitationData";
import { LevitationSection } from "components/ControlSections/LevitationSection/LevitationSection";
import { useMeasurements } from "../useMeasurements";
import { PCUSection } from "components/ControlSections/PCUSection/PCUSection";
import { extractPCUData } from "components/ControlSections/PCUSection/extractPCUData";

export const FirstPage = () => {
    const measurements = useMeasurements();

    return (
        <div className={styles.firstPageWrapper}>
            <LevitationSection data={extractLevitationData(measurements)} />
            <PCUSection data={extractPCUData(measurements)}></PCUSection>
        </div>
    );
};
