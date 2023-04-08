import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";

import { Order } from "models/Order";
export function useSendOrder() {
    return useWebSocketBroker("order/send");
}
