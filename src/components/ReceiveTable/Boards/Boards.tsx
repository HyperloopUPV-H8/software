import styles from "components/ReceiveTable/Boards/Boards.module.scss";
import { Board } from "models/PodData/Board";
import BoardSection from "components/ReceiveTable/Boards/BoardSection/BoardSection";

export const Boards = ({ boards }: { boards: { [name: string]: Board } }) => {
    return (
        <div className={styles.boardsWrapper}>
            {Object.values(boards).map((board) => {
                return <BoardSection key={board.name} board={board} />;
            })}
        </div>
    );
};
