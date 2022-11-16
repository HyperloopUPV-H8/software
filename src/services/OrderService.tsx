import { OrderWebAdapter } from "@adapters/OrderDescription";
import { useEffect, createContext, useRef } from "react";
import { Order, createOrder } from "@models/Order";
import { setOrders } from "@slices/ordersSlice";
import { useDispatch } from "react-redux";
import { createConnection } from "@models/Connection";
import { updateConnection } from "@slices/connectionsSlice";

interface IOrderService {
  sendOrder(order: Order): void;
}

export const OrderServiceContext = createContext<IOrderService>(
  {} as IOrderService
);

export const OrderService = ({ children }: any) => {
  const dispatch = useDispatch();
  let orderSocket!: React.MutableRefObject<WebSocket>;

  let orderService = {
    sendOrder(order: Order) {
      orderSocket.current.send(JSON.stringify(order));
    },
  };

  useEffect(() => {
    fetch(
      `http://${import.meta.env.VITE_SERVER_IP}:${
        import.meta.env.VITE_SERVER_PORT
      }${import.meta.env.VITE_ORDERS_URL}`
    )
      .then((response) => response.json())
      .then((orderDescriptions: OrderWebAdapter[]) => {
        let orders: Order[] = [];
        for (let orderDescription of orderDescriptions) {
          let order = createOrder(orderDescription);
          orders.push(order);
        }
        dispatch(setOrders(orders));
      });

    orderSocket = useRef(
      new WebSocket(
        `ws://${import.meta.env.VITE_SERVER_IP}:${
          import.meta.env.VITE_SERVER_PORT
        }${import.meta.env.VITE_ORDERS_URL}`
      )
    );
    dispatch(updateConnection(createConnection("Orders", false)));
    orderSocket.current.onopen = () => {
      dispatch(updateConnection(createConnection("Orders", true)));
    };
    orderSocket.current.onclose = () => {
      dispatch(updateConnection(createConnection("Orders", false)));
    };

    return () => {
      orderSocket.current.close();
    };
  }, []);

  return (
    <OrderServiceContext.Provider value={orderService}>
      {children}
    </OrderServiceContext.Provider>
  );
};
