import { CoilData } from "./CoilData";
import styles from "./CoilInfo.module.scss";
import { CoilInfoLabels } from "./CoilInfoLabels/CoilInfoLabels";
import { CurrentChart } from "./CurrentChart/CurrentChart";

type Props = {
    coilData: CoilData;
};

export const CoilInfo = ({ coilData }: Props) => {
    return (
        <article className={styles.coilInfoWrapper}>
            <CoilInfoLabels
                measurements={[
                    coilData.current,
                    coilData.currentRef,
                    coilData.temperature,
                ]}
            />
            <CurrentChart
                current={coilData.current}
                currentRef={coilData.currentRef}
            />
        </article>
    );
};
