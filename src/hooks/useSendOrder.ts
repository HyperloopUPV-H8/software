import { Order, useWsHandler } from "common";
export function useSendOrder() {
    const handler = useWsHandler();

    return (order: Omit<Order, "name">) => {
        handler.post("order/send", order);
    };
}
