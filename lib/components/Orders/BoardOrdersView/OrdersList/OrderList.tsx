import styles from "./OrdersList.module.scss";
import {
    Form as FormType,
    Order,
    OrderDescription,
    useSendOrder,
} from "../../../..";
import { createFormFromOrder } from "../../useOrders";
import { Form } from "./Form/Form";
type Props = {
    title: string;
    orders: OrderDescription[];
};

export const OrdersList = ({ title, orders }: Props) => {
    const sendOrder = useSendOrder();

    return (
        <div className={styles.orderList}>
            <span className={styles.title}>{title}</span>
            <div className={styles.orders}>
                {orders.map((order) => (
                    <Form
                        key={order.id}
                        initialForm={createFormFromOrder(order)}
                        onSubmit={(ev) => {
                            sendOrder(createOrder(order.id, ev));
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export function createOrder(id: number, form: FormType): Order {
    return {
        id: id,
        fields: Object.fromEntries(
            form.fields.map((field) => {
                if (field.type == "expandablePairs") {
                    return [field.id, field.value as any];
                }

                return [field.id, { value: field.value!, isEnabled: true }];
            })
        ),
    };
}
