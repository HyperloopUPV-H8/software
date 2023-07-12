import { VehicleOrders, useConfig, useFetchBack, useWsHandler } from "common";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setOrders, updateStateOrders } from "slices/ordersSlice";
import { nanoid } from "nanoid";

//TODO: make typed fetch function, from url you get response type

export function useOrders() {
    const dispatch = useDispatch();
    const handler = useWsHandler();
    const config = useConfig();
    const orderDescriptionPromise = useFetchBack(
        import.meta.env.PROD,
        config.paths.orderDescription
    );

    useEffect(() => {
        const controller = new AbortController();
        const id = nanoid();
        orderDescriptionPromise
            .then((descriptions: VehicleOrders) => {
                dispatch(setOrders(descriptions));
                handler.subscribe("order/stateOrders", {
                    id: id,
                    cb: (stateOrder) => {
                        dispatch(updateStateOrders(stateOrder));
                    },
                });
            })
            .catch((reason) => console.error(reason));

        return () => {
            controller.abort();
            handler.unsubscribe("order/stateOrders", id);
        };
    }, []);
}
