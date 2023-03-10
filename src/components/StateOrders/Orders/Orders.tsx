import styles from "./Orders.module.scss";
import { Order } from "../StateOrdersType"; //TODO: mover modelo a otra parte
import { Button } from "components/Button/Button";
import { useSendOrder } from "./useSendOrder";
type Props = {
    orders: Order[];
};

export const Orders = ({ orders }: Props) => {
    const sendAction = useSendOrder();

    return (
        <div className={styles.ordersWrapper}>
            {orders.map((order) => {
                return (
                    <Button
                        key={order.id}
                        label={order.name}
                        onClick={() => {
                            sendAction({ id: order.id });
                        }}
                    />
                );
            })}
        </div>
    );
};
