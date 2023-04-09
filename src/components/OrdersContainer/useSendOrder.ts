import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";

export function useSendOrder() {
    return useWebSocketBroker("order/send");
}
