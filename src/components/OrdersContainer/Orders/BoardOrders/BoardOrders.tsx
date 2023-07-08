import { BoardOrders } from "common";
import styles from "./BoardOrders.module.scss";
import { OrderForm } from "./OrderForm/OrderForm";

type Props = {
    boardOrders: BoardOrders;
    alwaysShowStateOrders: boolean;
};

export const BoardOrdersView = ({
    boardOrders,
    alwaysShowStateOrders,
}: Props) => {
    return (
        <div className={styles.boardOrders}>
            <div className={styles.name}>{boardOrders.name}</div>
            {boardOrders.orders.length > 0 && (
                <div className={styles.orders}>
                    <span className={styles.title}>Permanent orders</span>
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
            {boardOrders.stateOrders.length > 0 &&
                (alwaysShowStateOrders ||
                    boardOrders.stateOrders.some((item) => item.enabled)) && (
                    <div className={styles.stateOrders}>
                        <span className={styles.title}>State orders</span>
                        {boardOrders.stateOrders.map((desc) => {
                            if (alwaysShowStateOrders || desc.enabled) {
                                return (
                                    <OrderForm
                                        key={desc.id}
                                        description={desc}
                                    />
                                );
                            } else {
                                return false;
                            }
                        })}
                    </div>
                )}
        </div>
    );
};
