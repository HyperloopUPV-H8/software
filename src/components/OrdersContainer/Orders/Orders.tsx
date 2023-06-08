import styles from "./Orders.module.scss";
import { VehicleOrders } from "common";
import { OrderContext } from "./OrderContext";
import { useSendOrder } from "../useSendOrder";
import { BoardOrdersView } from "./BoardOrders/BoardOrders";

type Props = {
    orders: VehicleOrders;
};

export const Orders = ({ orders }: Props) => {
    const sendOrder = useSendOrder();

    return (
        <OrderContext.Provider value={sendOrder}>
            <div className={styles.ordersWrapper}>
                {orders.boards.map((board) => {
                    return (
                        (board.orders.length > 0 ||
                            board.stateOrders.length > 0) && (
                            <BoardOrdersView
                                key={board.name}
                                boardOrders={board}
                            />
                        )
                    );
                })}
            </div>
        </OrderContext.Provider>
    );
};
