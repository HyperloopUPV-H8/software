import styles from "./NewReceiveTable.module.scss";
import { BoardView } from "./BoardView/BoardView";
import { RootState, store } from "store";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Header } from "./Header/Header";
import { Board } from "common";
import { useInterval } from "hooks/useInterval";

// type Props = {
//     boards: Record<string, Board>;
// };

export const NewReceiveTable = () => {
    const boards = useMemo(() => store.getState().podData.boards, []);

    return (
        <div className={styles.newReceiveTable}>
            <Header items={["ID", "NAME", "COUNT", "CYCLE (ns)"]} />
            <div className={styles.boards}>
                {Object.values(boards).map((board) => {
                    return (
                        <BoardView
                            key={board.name}
                            board={board}
                        />
                    );
                })}
            </div>
        </div>
    );
};
