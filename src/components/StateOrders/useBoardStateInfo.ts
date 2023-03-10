import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";
import { StateAndOrders } from "./StateOrdersType";
import { useState } from "react";

export function useBoardStateInfo() {
    const [stateOrders, setStateOrders] = useState<StateAndOrders>({
        state: "DEFAULT",
        orders: [],
    });

    useWebSocketBroker("vcu/state", (msg: StateAndOrders) => {
        setStateOrders(msg);
    });

    return stateOrders;
}
