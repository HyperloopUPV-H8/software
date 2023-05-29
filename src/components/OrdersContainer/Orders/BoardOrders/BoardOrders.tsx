import { BoardOrders } from "common";
import styles from "./BoardOrders.module.scss";
import { OrderForm } from "./OrderForm/OrderForm";

type Props = {
    boardOrders: BoardOrders;
};

export const BoardOrdersView = ({ boardOrders }: Props) => {
    return (
        <div className={styles.boardOrders}>
            <div className={styles.name}>{boardOrders.name}</div>
            {boardOrders.orders && (
                <div className={styles.orders}>
                    <span className={styles.title}>Orders</span>
                    {boardOrders.orders.map((desc) => {
                        return (
                            <OrderForm
                                key={desc.id}
                                description={desc}
                            />
                        );
                    })}
                </div>
            )}
            {boardOrders.stateOrders.filter((item) => item.enabled).length >
                0 && (
                <div className={styles.stateOrders}>
                    <span className={styles.title}>State orders</span>
                    {boardOrders.stateOrders.map((desc) => {
                        return (
                            desc.enabled && (
                                <OrderForm
                                    key={desc.id}
                                    description={desc}
                                />
                            )
                        );
                    })}
                </div>
            )}
        </div>
    );
};
