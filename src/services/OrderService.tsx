import { OrderDescription, OrderWebAdapter } from "@adapters/OrderDescription";
import { useEffect, createContext, useRef } from "react";
import { Order, createOrderDescription } from "@models/Order";
import { setOrders } from "@slices/ordersSlice";
import { useDispatch } from "react-redux";
import { setConnectionState } from "@models/Connection";
import { updateWebsocketConnection } from "@slices/connectionsSlice";
import { mockOrderWebAdapters } from "@mocks/mockOrderDescriptions";
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
        console.error("Error converting orderDescriptions to JSON", reason)
      )
      .then((orderWebAdapters: { [key: string]: OrderWebAdapter }) => {
        let orders: OrderDescription[] = Object.values(orderWebAdapters).map(
          (adapter) => {
            return createOrderDescription(adapter);
          }
        );
        dispatch(setOrders(orders));
      });
  }

  function createOrderWebSocket() {
    orderSocket.current = new WebSocket(
      `ws://${import.meta.env.VITE_SERVER_IP}:${
        import.meta.env.VITE_SERVER_PORT
      }${import.meta.env.VITE_ORDERS_URL}`
    );
    dispatch(updateWebsocketConnection(setConnectionState("Orders", false)));
    orderSocket.current.onopen = () => {
      dispatch(updateWebsocketConnection(setConnectionState("Orders", true)));
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
      dispatch(updateWebsocketConnection(setConnectionState("Orders", false)));
    };
  }

  return (
    <OrderServiceContext.Provider value={orderService.current}>
      {children}
    </OrderServiceContext.Provider>
  );
};
