import { ReactNode, useMemo } from "react";
import styles from "./StateOverlay.module.scss";
import { State, stateToColor } from "state";

type Props = {
    state: State;
    children: ReactNode;
};

export const StateOverlay = ({ state, children }: Props) => {
    return (
        <div className={styles.stateOverlay}>
            <div
                className={styles.overlay}
                style={{ backgroundColor: stateToColor[state] }}
            />
            {children}
        </div>
    );
};
