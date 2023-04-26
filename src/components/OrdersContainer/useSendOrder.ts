import { useBroker } from "common";

export function useSendOrder() {
    return useBroker("order/send");
}
