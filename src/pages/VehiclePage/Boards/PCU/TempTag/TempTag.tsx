import { ReactNode } from "react";
import styles from "./TempTag.module.scss";
import { NumericMeasurement } from "common";
import { StateOverlay } from "components/StateOverlay/StateOverlay";
import { getState } from "state";

type Props = {
    meas: NumericMeasurement;
    icon: ReactNode;
};

export const TempTag = ({ meas, icon }: Props) => {
    return (
        <StateOverlay state={getState(meas)}>
            <div className={styles.tempTag}>
                <div className={styles.title}>{meas.name}</div>
                <div className={styles.icon}>{icon}</div>
                <div className={styles.value}>
                    {`${meas.value.last.toFixed(2)} ${meas.units}`}
                </div>
            </div>
        </StateOverlay>
    );
};
