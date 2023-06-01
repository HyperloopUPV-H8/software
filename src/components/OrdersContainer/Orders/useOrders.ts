import {
    OrderDescription,
    OrderFieldDescription,
    VehicleOrders,
    useWsHandler,
} from "common";
import { useEffect } from "react";
import { fetchBack } from "common";
import { config } from "common";
import { useDispatch, useSelector } from "react-redux";
import { setOrders, updateStateOrders } from "slices/ordersSlice";
import { RootState } from "store";

//TODO: make typed fetch function, from url you get response type

export function useOrders() {
    const handler = useWsHandler();
    const dispatch = useDispatch();

    useEffect(() => {
        const controller = new AbortController();

        fetchBack(config.paths.orderDescription, controller.signal)
            .then((descriptions: VehicleOrders) => {
                dispatch(setOrders(descriptions));
            })
            .catch((reason) => console.error(reason));

        handler.subscribe("order/stateOrders", (stateOrders) => {
            dispatch(updateStateOrders(stateOrders));
        });

        return () => {
            controller.abort();
        };
    }, []);

    return useSelector((state: RootState) => state.orders);
}
