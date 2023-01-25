import { useState } from "react";
import styles from "components/ReceiveTable/ReceiveTable.module.scss";
import { Headers } from "components/ReceiveTable/Headers/Headers";
import { Boards } from "components/ReceiveTable/Boards/Boards";
import { useInterval } from "hooks/useInterval";
import { Board } from "models/PodData/Board";
import { store } from "../../store";

export const ReceiveTable = () => {
    const [boards, setBoards] = useState({} as { [name: string]: Board });

    useInterval(() => {
        let boards = store.getState().podData.boards;
        setBoards(boards);
    }, 1000 / 100);

    return (
        <div className={styles.receiveTableWrapper}>
            <Headers />
            <Boards boards={boards} />
        </div>
    );
};
