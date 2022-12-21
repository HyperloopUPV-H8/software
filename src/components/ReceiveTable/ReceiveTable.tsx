import { useState } from "react";
import styles from "@components/ReceiveTable/ReceiveTable.module.scss";
import { Headers } from "@components/ReceiveTable/Headers/Headers";
import BoardSection from "@components/ReceiveTable/BoardSection/BoardSection";
import { useInterval } from "@hooks/useInterval";
import { Board } from "@models/PodData/Board";
import { store } from "../../store";

export const ReceiveTable = () => {
    const [boards, setBoards] = useState({} as { [name: string]: Board });

    useInterval(() => {
        let boards = store.getState().podData.boards;
        setBoards(boards);
    }, 1000 / 100);

    return (
        <div id={styles.wrapper}>
            <Headers />
            <Boards boards={boards} />
        </div>
    );
};

const Boards = ({ boards }: { boards: { [name: string]: Board } }) => {
    return (
        <div className={styles.boards}>
            {Object.values(boards).map((board) => {
                return <BoardSection key={board.name} board={board} />;
            })}
        </div>
    );
};
