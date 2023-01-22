import styles from "components/TransmitTable/TransmitTable.module.scss";
import { OrderForm } from "components/TransmitTable/OrderForm/OrderForm";
import { OrderServiceContext } from "services/OrderService";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";

export const TransmitTable = () => {
    const orderService = useContext(OrderServiceContext);
    const orderDescriptions = useSelector((state: RootState) => {
        return state.orders;
    });

    return (
        <div id={styles.wrapper}>
            {orderDescriptions.map((orderDescription) => {
                return (
                    <OrderForm
                        key={orderDescription.id}
                        orderDescription={orderDescription}
                        sendOrder={orderService.sendOrder}
                    />
                );
            })}
        </div>
    );
};
