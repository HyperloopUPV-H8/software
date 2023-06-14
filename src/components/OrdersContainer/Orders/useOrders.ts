import { StateOrdersUpdate, VehicleOrders, useWsHandler } from "common";
import { useEffect } from "react";
import { config } from "common";
import { useDispatch, useSelector } from "react-redux";
import { setOrders, updateStateOrders } from "slices/ordersSlice";
import { RootState } from "store";
import { nanoid } from "nanoid";

//TODO: make typed fetch function, from url you get response type

export function useOrders() {
    const dispatch = useDispatch();
    const handler = useWsHandler();

    useEffect(() => {
        const controller = new AbortController();
        const stateOrderCallback = {
            id: nanoid(),
            cb: (stateOrder: StateOrdersUpdate) => {
                dispatch(updateStateOrders(stateOrder));
            },
        };

        fetch(
            `http://${config.server.ip}:${config.server.port}/${config.paths.orderDescription}`
        )
            .then((res) => res.json())
            .then((descriptions: VehicleOrders) => {
                dispatch(setOrders(descriptions));
                handler.subscribe("order/stateOrders", stateOrderCallback);
            })
            .catch((reason) => console.error(reason));

        return () => {
            controller.abort();
            handler.unsubscribe("order/stateOrders", stateOrderCallback.id);
        };
    }, []);

    return useSelector((state: RootState) => state.orders);
}
