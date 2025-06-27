import styles from "./ReceiveTable.module.scss";
import { BoardView } from "./BoardView/BoardView";
import { Header } from "./Header/Header";
import { TableUpdater } from "./TableUpdater";
import { Board, useMeasurementsStore} from "common";

type Props = {
    boards: Board[];
};

export const ReceiveTable = ({ boards }: Props) => {
    const handleLogAll = (log: boolean) => {
        useMeasurementsStore.getState().setLogAll(log);
    };
    return (
        <TableUpdater>
            <div className={styles.newReceiveTable}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ flex: 1 }}></div>
                    <button
                        onClick={() => handleLogAll(true)}
                        style={{ background: 'green', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', marginRight: 4 }}
                    >
                        Log all
                    </button>
                    <button
                        onClick={() => handleLogAll(false)}
                        style={{ background: '#aaa', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}
                    >
                        Log none
                    </button>
                </div>
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
