import { useBackendWebSocket } from "hooks/useBackendWebSocket";
import { Order } from "models/Order";
export function useOrders() {
    const sendWS = useBackendWebSocket("order/send");

    return (order: Order) => {
        sendWS(JSON.stringify(order));
    };
}
