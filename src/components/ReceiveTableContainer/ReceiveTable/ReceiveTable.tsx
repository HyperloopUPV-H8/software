import styles from "./ReceiveTable.module.scss";
import { BoardView } from "./BoardView/BoardView";
import { Header } from "./Header/Header";
import { Board } from "common";
import { TableUpdater } from "./TableUpdater";

type Props = {
    boards: Record<string, Board>;
};

const RECEIVE_TABLE_HEADERS = ["ID", "NAME", "COUNT", "CYCLE (ns)"];

export const ReceiveTable = ({ boards }: Props) => {
    return (
        <TableUpdater>
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
        </TableUpdater>
    );
};
