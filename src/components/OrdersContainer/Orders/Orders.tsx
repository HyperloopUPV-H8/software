import styles from "./Orders.module.scss";
import { OrderDescription } from "common";
import { OrderForm } from "./OrderForm/OrderForm";
import { Order } from "common";

type Props = {
    sendOrder: (order: Order) => void;
    orderDescriptions: Record<string, OrderDescription>;
};

export const Orders = ({ orderDescriptions, sendOrder }: Props) => {
    return (
        <div className={styles.ordersWrapper}>
            {Object.values(orderDescriptions).map((description) => {
                return (
                    <OrderForm
                        key={description.id}
                        description={description}
                        sendOrder={sendOrder}
                    />
                );
            })}
        </div>
    );
};
