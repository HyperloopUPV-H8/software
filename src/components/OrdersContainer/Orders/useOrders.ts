import {
    VehicleOrders,
    useSubscribe,
} from "common";
import { useEffect } from "react";
import { config } from "common";
import { useDispatch, useSelector } from "react-redux";
import { setOrders, updateStateOrders } from "slices/ordersSlice";
import { RootState } from "store";

//TODO: make typed fetch function, from url you get response type

export function useOrders() {
    const dispatch = useDispatch();

    useSubscribe("order/stateOrders", (stateOrders) => {
        dispatch(updateStateOrders(stateOrders));
    });

    useEffect(() => {
        const controller = new AbortController();

        fetch(
            `http://${config.server.ip}:${config.server.port}/${config.paths.orderDescription}`
        )
            .then((res) => res.json())
            .then((descriptions: VehicleOrders) => {
                dispatch(setOrders(descriptions));
            })
            .catch((reason) => console.error(reason));



        return () => {
            controller.abort();
        };
    }, []);

    return useSelector((state: RootState) => state.orders);
}
