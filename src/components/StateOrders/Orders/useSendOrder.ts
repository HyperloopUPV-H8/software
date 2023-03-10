import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";
import { Order } from "components/StateOrders/StateOrdersType";

export function useSendOrder() {
    const sendWS = useWebSocketBroker("order/send");

    return (action: Omit<Order, "name">) => {
        sendWS(JSON.stringify(action));
    };
}
