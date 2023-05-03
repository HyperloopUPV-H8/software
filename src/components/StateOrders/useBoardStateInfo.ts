import { useBroker } from "common";
import { StateAndOrders } from "./StateOrdersType";
import { useState } from "react";

export function useBoardStateInfo() {
    const [stateOrders, setStateOrders] = useState<StateAndOrders>({
        state: "DEFAULT",
        orders: [],
    });

    useBroker("vcu/state", (msg: StateAndOrders) => {
        setStateOrders(msg);
    });

    return stateOrders;
}
