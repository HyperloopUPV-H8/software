import { VehicleOrders, useConfig, useFetchBack, useOrdersStore, useWsHandler } from "common";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { nanoid } from "nanoid";

//TODO: make typed fetch function, from url you get response type

export function useOrders() {
    const setOrders = useOrdersStore((state) => state.setOrders);
    const updateStateOrders = useOrdersStore((state) => state.updateStateOrders);
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
                setOrders(descriptions);
                handler.subscribe("order/stateOrders", {
                    id: id,
                    cb: (stateOrder) => {
                        updateStateOrders(stateOrder);
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
