import styles from "./Orders.module.scss";
import { useOrders } from "./useOrders";
import { BoardOrdersView } from "./BoardOrdersView/BoardOrdersView";
import { BoardOrders, OrderDescription } from "../..";

// type Props = {
//     boards: string[];
// };

type Props = {
    orders: BoardOrders[];
};

export const Orders = ({ orders }: Props) => {
    // const boardOrders = useOrders().filter((board) =>
    //     boards.includes(board.name)
    // );

    return (
        <div className={styles.orders}>
            {orders.map((board) => (
                <BoardOrdersView
                    key={board.name}
                    board={board}
                    showName={true}
                />
            ))}
        </div>
    );
};
