import styles from "./BoardOrders.module.scss";
import { StateView } from "./StateView/StateView";
import { Window } from "components/Window/Window";
import { createFormFromOrder, useBoardOrders } from "./useBoardOrders";
import { Form } from "./Form/Form";
import { Form as FormType, Order, useSendOrder } from "common";

type Props = {
    name: string;
};

const VehiclePathId = 206;

export const BoardOrders = ({ name }: Props) => {
    const orders = useBoardOrders(name);
    const sendOrder = useSendOrder();

    return (
        <Window
            title={`${name} Orders`}
            height="fill"
        >
            <main className={styles.stateOrdersWrapper}>
                <StateView
                    boardName={name}
                    state={"Default"}
                />
                <div className={styles.forms}>
                    {orders.map((order) => {
                        if (order.id == VehiclePathId) {
                            return (
                                <Form
                                    key={order.id.toString()}
                                    initialForm={{
                                        id: order.id.toString(),
                                        name: "Vehicle path",
                                        fields: [
                                            {
                                                id: "vehicle_path",
                                                name: "Vehicle Path",
                                                type: "expandablePairs",
                                                value: [[null, null]],
                                            },
                                        ],
                                    }}
                                    onSubmit={(ev) => {
                                        const field = ev.fields[0];
                                        if (field.type == "expandablePairs") {
                                            for (const pair of field.value) {
                                                sendOrder({
                                                    id: VehiclePathId,
                                                    fields: {
                                                        position: {
                                                            value: pair[0]!,
                                                            isEnabled: true,
                                                        },
                                                        velocity: {
                                                            value: pair[1]!,
                                                            isEnabled: true,
                                                        },
                                                    },
                                                });
                                            }
                                        }
                                    }}
                                />
                            );
                        } else {
                            const form = createFormFromOrder(order);
                            return (
                                <Form
                                    key={form.id}
                                    initialForm={form}
                                    onSubmit={(ev) => {
                                        sendOrder(createOrder(order.id, ev));
                                    }}
                                />
                            );
                        }
                    })}
                </div>
            </main>
        </Window>
    );
};

function createOrder(orderId: number, form: FormType): Order {
    const fields = form.fields.flatMap((field) =>
        field.type != "expandablePairs" ? [field] : []
    );

    const fieldsObject = Object.fromEntries(
        fields.map((field) => [field.id, field])
    );

    return {
        id: orderId,
        fields: fieldsObject as any,
    };
}
