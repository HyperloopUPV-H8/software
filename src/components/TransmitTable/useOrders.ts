import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";

import { Order } from "models/Order";
export function useOrders() {
    const sendWS = useWebSocketBroker("order/send");

    return (order: Order) => {
        sendWS(JSON.stringify(order));
    };
}
