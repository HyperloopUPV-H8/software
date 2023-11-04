import styles from "./ReceiveTable.module.scss";
import { BoardView } from "./BoardView/BoardView";
import { Header } from "./Header/Header";
import { TableUpdater } from "./TableUpdater";
import { Board } from "common";

type Props = {
    boards: Board[];
};

export const ReceiveTable = ({ boards }: Props) => {
    return (
        <TableUpdater>
            <div className={styles.newReceiveTable}>
                <Header items={["ID", "NAME", "COUNT", "CYCLE (ns)"]} />
                <div className={styles.boards}>
                    {boards
                        .filter((item) => item.packets.length > 0)
                        .map((board) => {
                            return (
                                <BoardView
                                    key={board.name}
                                    board={board}
                                />
                            );
                        })}
                </div>
            </div>
        </TableUpdater>
    );
};
