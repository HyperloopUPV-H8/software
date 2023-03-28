import styles from "components/OrderTable/Orders/Orders.module.scss";
import { OrderDescription } from "adapters/Order";
import { OrderForm } from "./OrderForm/OrderForm";
import { Order } from "models/Order";

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
                        orderDescription={description}
                        sendOrder={sendOrder}
                    />
                );
            })}
        </div>
    );
};
