import { OrderDescription, OrderWebAdapter } from "@adapters/OrderDescription";
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
  let orderSocket = useRef<WebSocket>();

  useEffect(() => {
    fetch(
      `http://${import.meta.env.VITE_SERVER_IP}:${
        import.meta.env.VITE_SERVER_PORT
      }${import.meta.env.VITE_ORDER_DESCRIPTIONS_URL}`
    )
      .then((response) => response.json())
      .then((orderWebAdapter: OrderWebAdapter[]) => {
        let orders: OrderDescription[] = [];
        for (let adapter of orderWebAdapter) {
          let order = createOrder(adapter);
          orders.push(order);
        }
        dispatch(setOrders(orders));
      })
      .catch((reason) => {
        console.error(`Error fetching Orders Description: ${reason}`);
      });

    orderSocket.current = new WebSocket(
      `ws://${import.meta.env.VITE_SERVER_IP}:${
        import.meta.env.VITE_SERVER_PORT
      }${import.meta.env.VITE_ORDERS_URL}`
    );
    dispatch(updateConnection(createConnection("Orders", false)));
    orderSocket.current.onopen = () => {
      dispatch(updateConnection(createConnection("Orders", true)));
    };
    orderSocket.current.onclose = () => {
      dispatch(updateConnection(createConnection("Orders", false)));
    };

    return () => {
      if (orderSocket.current) {
        orderSocket.current.close();
      }
    };
  }, []);

  let orderService = {
    sendOrder(order: Order) {
      //FIXME: could be undefined
      console.log(order);
      orderSocket.current!.send(JSON.stringify(order));
    },
  };

  return (
    <OrderServiceContext.Provider value={orderService}>
      {children}
    </OrderServiceContext.Provider>
  );
};
