import styles from "./OrdersContainer.module.scss";
import { useSendOrder } from "./useSendOrder";
import { Orders } from "./Orders/Orders";
import { useOrderDescriptions } from "./useOrderDescriptions";

export const OrdersContainer = () => {
    const sendOrder = useSendOrder();
    const orderDescriptions = useOrderDescriptions();

    return (
        <div className={styles.orderTableWrapper}>
            {Object.keys(orderDescriptions).length == 0 ? (
                <span className={styles.emptyAlert}>
                    Orders added to ADE will appear here
                </span>
            ) : (
                <Orders
                    orderDescriptions={orderDescriptions}
                    sendOrder={sendOrder}
                />
            )}
        </div>
    );
};
