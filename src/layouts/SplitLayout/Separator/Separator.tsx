import { Direction } from "layouts/SplitLayout/Direction";
import styles from "layouts/SplitLayout/Separator/Separator.module.scss";
import React from "react";

type Props = {
    index: number;
    direction: Direction;
    handleSeparatorMouseDown: (index: number, ev: React.MouseEvent) => void;
};

export const Separator = ({
    index,
    direction,
    handleSeparatorMouseDown,
}: Props) => {
    return (
        <div
            className={styles.wrapper}
            style={{
                cursor:
                    direction == Direction.HORIZONTAL ? "e-resize" : "n-resize",
            }}
            onMouseDown={(ev) => {
                handleSeparatorMouseDown(index, ev);
            }}
        >
            <div className={styles.line}></div>
        </div>
    );
};
