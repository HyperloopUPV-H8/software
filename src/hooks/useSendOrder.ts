import { useBroker } from "common";

import { Order } from "common";
export function useSendOrder() {
    const sendWS = useBroker("order/send");

    return (order: Omit<Order, "name">) => {
        sendWS(order);
    };
}
