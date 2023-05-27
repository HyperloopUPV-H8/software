import styles from "./ReceiveTable.module.scss";
import { BoardView } from "./BoardView/BoardView";
import { Header } from "./Header/Header";
import { Board, useSubscribe } from "common";
import { TableUpdater } from "./TableUpdater";
import { useDispatch } from "react-redux";
import { updatePodData } from "slices/podDataSlice";
import { updateMeasurements } from "slices/measurementsSlice";

type Props = {
    boards: Board[];
};

export const ReceiveTable = ({ boards }: Props) => {
    const dispatch = useDispatch();

    useSubscribe("podData/update", (update) => {
        dispatch(updatePodData(update));
        dispatch(updateMeasurements(update));
    });

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
