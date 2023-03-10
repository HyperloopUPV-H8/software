import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";
import { Order } from "components/StateOrders/StateOrdersType";

export function useSendOrder() {
    const sendWS = useWebSocketBroker("vcu/sendAction");

    return (action: Omit<Order, "name">) => {
        sendWS(JSON.stringify(action));
    };
}
