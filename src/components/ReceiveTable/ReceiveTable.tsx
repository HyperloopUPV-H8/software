import styles from "components/ReceiveTable/ReceiveTable.module.scss";
import { Headers } from "components/ReceiveTable/Headers/Headers";
import { Boards } from "components/ReceiveTable/Boards/Boards";
import { Board } from "common";
import { useState } from "react";
import { useInterval } from "hooks/useInterval";
import { store } from "store";

export const ReceiveTable = () => {
    const [boards, setBoards] = useState<Record<string, Board>>({});

    useInterval(() => {
        setBoards(store.getState().podData.boards);
    }, 1000 / 50);

    return (
        <div className={styles.receiveTableWrapper}>
            <Headers />
            <Boards boards={boards} />
        </div>
    );
};
