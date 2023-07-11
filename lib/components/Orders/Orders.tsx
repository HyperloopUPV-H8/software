import styles from "./Orders.module.scss";
import { useOrders } from "./useOrders";
import { BoardOrdersView } from "./BoardOrdersView/BoardOrdersView";

type Props = {
    boards: string[];
};

export const Orders = ({ boards }: Props) => {
    const boardOrders = useOrders().filter((board) =>
        boards.includes(board.name)
    );

    return (
        <div className={styles.orders}>
            {boardOrders.map((board) => (
                <BoardOrdersView
                    key={board.name}
                    board={board}
                    showName={true}
                />
            ))}
        </div>
    );
};
