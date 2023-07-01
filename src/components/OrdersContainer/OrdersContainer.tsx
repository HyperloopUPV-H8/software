import styles from "./OrdersContainer.module.scss";
import { Orders } from "./Orders/Orders";
import { useOrders } from "./Orders/useOrders";

export const OrdersContainer = () => {
    const orders = useOrders();

    return (
        <div className={styles.orderTableWrapper}>
            {orders.boards.length == 0 ? (
                <span className={styles.emptyAlert}>
                    Orders added to ADE will appear here
                </span>
            ) : (
                <Orders orders={orders} />
            )}
        </div>
    );
};
