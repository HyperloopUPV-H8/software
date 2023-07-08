import styles from "./Orders.module.scss";
import { Button, VehicleOrders } from "common";
import { OrderContext } from "./OrderContext";
import { useSendOrder } from "../useSendOrder";
import { BoardOrdersView } from "./BoardOrders/BoardOrders";
import { useState } from "react";

type Props = {
    orders: VehicleOrders;
};

export const Orders = ({ orders }: Props) => {
    const sendOrder = useSendOrder();
    const [alwaysShowStateOrders, setAlwaysShowStateOrders] = useState(false);

    return (
        <OrderContext.Provider value={sendOrder}>
            <div className={styles.ordersWrapper}>
                <div className={styles.stateOrdersToggle}>
                    Always show state orders: {alwaysShowStateOrders}
                    <Button
                        label="Toggle"
                        onClick={() =>
                            setAlwaysShowStateOrders((prev) => !prev)
                        }
                    />
                </div>
                <div className={styles.boardOrderList}>
                    {orders.boards.map((board) => {
                        return (
                            (board.orders.length > 0 ||
                                board.stateOrders.length > 0) && (
                                <BoardOrdersView
                                    key={board.name}
                                    boardOrders={board}
                                    alwaysShowStateOrders={
                                        alwaysShowStateOrders
                                    }
                                />
                            )
                        );
                    })}
                </div>
            </div>
        </OrderContext.Provider>
    );
};
