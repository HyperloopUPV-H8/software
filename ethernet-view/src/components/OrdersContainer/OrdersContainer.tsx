import styles from "./OrdersContainer.module.scss";
import { Orders } from "./Orders/Orders";
import { orderSlice, useConfig, useFetchBack } from "common";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useOrders } from "common";

export const OrdersContainer = () => {
    const dispatch = useDispatch();
    const config = useConfig();

    const orderDescriptionPromise = useFetchBack(
        import.meta.env.PROD,
        config.paths.orderDescription
    );
    useEffect(() => {
        orderDescriptionPromise.then((desc) => {
            dispatch(orderSlice.actions.setOrders(desc));
        });
    }, []);

    const orders = useOrders();

    return (
        <div className={styles.orderTableWrapper}>
            {orders.length == 0 ? (
                <span className={styles.emptyAlert}>
                    Orders added to ADE will appear here
                </span>
            ) : (
                <Orders boards={orders} />
            )}
        </div>
    );
};
