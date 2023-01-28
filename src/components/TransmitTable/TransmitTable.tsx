import styles from "components/TransmitTable/TransmitTable.module.scss";
import { OrderForm } from "components/TransmitTable/OrderForm/OrderForm";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useOrders } from "components/TransmitTable//useOrders";
export const TransmitTable = () => {
    const sendOrder = useOrders();
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
                        sendOrder={sendOrder}
                    />
                );
            })}
        </div>
    );
};
