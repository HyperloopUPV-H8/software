import { OrderDescription, OrderAdapter, createEnum } from "@adapters/Order";
import { useEffect, createContext, useRef } from "react";
import { Order } from "@models/Order";
import { setOrders } from "@slices/ordersSlice";
import { useDispatch } from "react-redux";
import { updateWebsocketConnection } from "@slices/connectionsSlice";
import { createConnection } from "@models/Connection";

interface IOrderService {
    sendOrder(order: Order): void;
}

export const OrderServiceContext = createContext<IOrderService>(
    {} as IOrderService
);

export const OrderService = ({ children }: any) => {
    const dispatch = useDispatch();
    const orderSocket = useRef<WebSocket>();
    const orderService = useRef({
        sendOrder(order: Order) {
            orderSocket.current!.send(JSON.stringify(order));
        },
    });

    useEffect(() => {
        fetchOrderDescriptions();
        createOrderWebSocket();

        return () => {
            if (orderSocket.current) {
                orderSocket.current.close();
            }
        };
    }, []);

    function fetchOrderDescriptions() {
        fetch(
            `http://${import.meta.env.VITE_SERVER_IP}:${
                import.meta.env.VITE_SERVER_PORT
            }${import.meta.env.VITE_ORDER_DESCRIPTIONS_URL}`
        )
            .catch((reason) => {
                console.error("Error fetching order descriptions", reason);
            })
            .then((response) => response!.json())
            .catch((reason) =>
                console.error(
                    "Error converting orderDescriptions to JSON",
                    reason
                )
            )
            .then((orderWebAdapters: { [key: string]: OrderAdapter }) => {
                let orders: OrderDescription[] = Object.values(
                    orderWebAdapters
                ).map((adapter) => {
                    return {
                        id: adapter.id,
                        name: adapter.name,
                        fieldDescriptions: getFieldDescriptions(
                            adapter.fieldDescriptions
                        ),
                    };
                });
                dispatch(setOrders(orders));
            });
    }

    function getFieldDescriptions(
        descriptions: OrderAdapter["fieldDescriptions"]
    ): OrderDescription["fieldDescriptions"] {
        return Object.fromEntries(
            Object.entries(descriptions).map(([name, fieldDescriptionStr]) => {
                let type, value;
                if (/^ENUM/.test(fieldDescriptionStr)) {
                    type = "Enum";
                    value = createEnum(fieldDescriptionStr);
                } else {
                    type = "Default";
                    value = fieldDescriptionStr;
                }
                return [name, { type, value }];
            })
        );
    }

    function createOrderWebSocket() {
        orderSocket.current = new WebSocket(
            `ws://${import.meta.env.VITE_SERVER_IP}:${
                import.meta.env.VITE_SERVER_PORT
            }${import.meta.env.VITE_ORDERS_URL}`
        );
        dispatch(updateWebsocketConnection(createConnection("Orders", false)));
        orderSocket.current.onopen = () => {
            dispatch(
                updateWebsocketConnection(createConnection("Orders", true))
            );
        };
        orderSocket.current.onerror = () => {
            //TODO: move all error handling to a separate file and make functions to create errors
            console.error("Error in Order WebSocket");
        };
        orderSocket.current.onerror = () => {
            //TODO: move all error handling to a separate file and make functions to create errors
            console.error("Error in Order WebSocket");
        };
        orderSocket.current.onclose = () => {
            dispatch(
                updateWebsocketConnection(createConnection("Orders", false))
            );
        };
    }

    return (
        <OrderServiceContext.Provider value={orderService.current}>
            {children}
        </OrderServiceContext.Provider>
    );
};
