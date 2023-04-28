import styles from "./NewReceiveTable.module.scss";
import { BoardView } from "./BoardView/BoardView";
import { RootState, store } from "store";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Header } from "./Header/Header";

// type Props = {
//     boards: Record<string, Board>;
// };

export const NewReceiveTable = () => {
    const boards = useSelector((state: RootState) => state.podData.boards);

    return (
        <div className={styles.newReceiveTable}>
            <Header />
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
