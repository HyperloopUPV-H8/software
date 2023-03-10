import styles from "./Orders.module.scss";
import { Order } from "models/Order"; //TODO: mover modelo a otra parte
import { Button } from "components/Button/Button";
import { useSendOrder } from "hooks/useSendOrder";
type Props = {
    orders: Order[];
};

export const Orders = ({ orders }: Props) => {
    const sendOrder = useSendOrder();

    return (
        <div className={styles.ordersWrapper}>
            {orders.map((order) => {
                return (
                    <Button
                        key={order.id}
                        label={order.name}
                        onClick={() => {
                            sendOrder({ id: order.id, fields: {} });
                        }}
                    />
                );
            })}
        </div>
    );
};
