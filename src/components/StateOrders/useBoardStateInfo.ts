import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";
import { StateAndOrders } from "./StateOrdersType";
import { useState } from "react";

export function useBoardStateInfo() {
    const [stateActions, setStateActions] = useState<StateAndOrders>({
        state: "OPERATIONAL",
        actions: [
            { id: 0, name: "Order 0" },
            { id: 1, name: "Order 1" },
            { id: 2, name: "Order 2" },
            { id: 3, name: "Order 3" },
        ],
    });

    useWebSocketBroker("vcu/state", (msg: StateAndOrders) => {
        setStateActions(msg);
    });

    return stateActions;
}
