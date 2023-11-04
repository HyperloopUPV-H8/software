import { Order, useWsHandler } from "..";

export function useSendOrder() {
    const handler = useWsHandler();

    return (order: Order) => {
        handler.post("order/send", order);
    };
}
