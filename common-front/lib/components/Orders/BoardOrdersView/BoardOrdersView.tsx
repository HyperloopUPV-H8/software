import { BoardOrders } from "../../..";
import styles from "./BoardOrdersView.module.scss";
import { OrdersList } from "./OrdersList/OrderList";

type Props = {
    board: BoardOrders;
    showName: boolean;
};

export const BoardOrdersView = ({ board, showName }: Props) => {
    const stateOrders = board.stateOrders.filter((order) => order.enabled);

    return (
        <div className={styles.boardOrdersView}>
            {showName && <div className={styles.name}>{board.name}</div>}
            <div className={styles.orders}>
                {board.orders.length > 0 && (
                    <OrdersList
                        title="Permanent orders"
                        orders={board.orders}
                    />
                )}
                {stateOrders.length > 0 && (
                    <OrdersList
                        title="State orders"
                        orders={stateOrders}
                    />
                )}
            </div>
        </div>
    );
};
