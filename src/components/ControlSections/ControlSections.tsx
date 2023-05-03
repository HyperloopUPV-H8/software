import styles from "./ControlSections.module.scss";
import { LevitationData } from "./LevitationSection/LevitationData";
import { LevitationSection } from "./LevitationSection/LevitationSection";
import { PCUData } from "./PCUSection/PCUData";
import { PCUSection } from "./PCUSection/PCUSection";

type ControlData = {
    levitationData: LevitationData;
    propulsionData: PCUData;
};

type Props = {
    controlData: ControlData;
};

export const ControlSections = ({ controlData }: Props) => {
    return (
        <div className={styles.controlSectionsWrapper}>
            <LevitationSection data={controlData.levitationData} />
            <PCUSection data={controlData.propulsionData} />
        </div>
    );
};
