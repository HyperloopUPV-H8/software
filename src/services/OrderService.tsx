import { OrderDescription } from "@adapters/OrderDescription";
import { useEffect, createContext, useRef } from "react";
import { Order, createOrder } from "@models/Order";
import { setOrders } from "@slices/ordersSlice";

interface IOrderService {
  sendOrder(order: Order): void;
}

export const OrderServiceContext = createContext<IOrderService>(
  {} as IOrderService
);

export const OrderService = ({ children }: any) => {
  const orderSocket = useRef(
    new WebSocket(
      `ws://${process.env.SERVER_IP}:${process.env.SERVER_PORT}${process.env.ORDERS_DESCRIPTION_URL}`
    )
  );

  let orderService = {
    sendOrder(order: Order) {
      orderSocket.current.send(JSON.stringify(order));
    },
  };

  useEffect(() => {
    fetch(
      `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}/backend/orders`
    )
      .then((response) => response.json())
      .then((orderDescriptions: OrderDescription[]) => {
        let orders: Order[] = [];
        for (let orderDescription of orderDescriptions) {
          let order = createOrder(orderDescription);
          orders.push(order);
        }
        setOrders(orders);
      });
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
