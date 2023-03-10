import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";
import { StateAndOrders } from "./StateOrdersType";
import { useState } from "react";

export function useBoardStateInfo() {
    const [stateActions, setStateActions] = useState<StateAndOrders>({
        state: "DEFAULT",
        actions: [],
    });

    useWebSocketBroker("vcu/state", (msg: StateAndOrders) => {
        setStateActions(msg);
    });

    return stateActions;
}
