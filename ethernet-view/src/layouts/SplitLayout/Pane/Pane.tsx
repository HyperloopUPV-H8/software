import styles from "layouts/SplitLayout/Pane/Pane.module.scss";

import React from "react"; // Add missing import

type Props = {
    component: React.ReactNode;
    normalizedLength: number;
    collapsedIcon: string;
};

export const Pane = ({ component, normalizedLength, collapsedIcon }: Props) => {
    return normalizedLength === 0 ? (
        <div className={styles.collapsed}>
            <div className={styles.icon}>
                <img src={collapsedIcon} alt="collapsed" />
            </div>
        </div>
    ) : (
        <div
            className={styles.wrapper}
            style={{
                flex: normalizedLength,
            }}
        >
            {component}
        </div>
    );
};
