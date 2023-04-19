import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";

import { Order } from "models/Order";
export function useSendOrder() {
    const sendWS = useWebSocketBroker("order/send");

    return (order: Omit<Order, "name">) => {
        sendWS(JSON.stringify(order));
    };
}
