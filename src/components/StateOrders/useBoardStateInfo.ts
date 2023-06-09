import { useSubscribe } from "common";
import { StateAndOrders } from "./StateOrdersType";
import { useState } from "react";

export function useBoardStateInfo() {
    const [stateOrders, setStateOrders] = useState<StateAndOrders>({
        state: "DEFAULT",
        orders: [],
    });

    useSubscribe("vcu/state", (msg: StateAndOrders) => {
        setStateOrders(msg);
    });

    return stateOrders;
}
