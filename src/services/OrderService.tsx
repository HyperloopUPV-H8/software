import { OrderDescription } from "@adapters/OrderDescription";
import { useContext, useEffect, useState, createContext, useRef } from "react";
import { Order } from "@models/Order";
import { writeSync } from "fs";

export interface IOrderService {
  getOrderDescriptions(): Promise<OrderDescription[]>;
  sendOrder(order: Order): void;
}

export const OrderContext = createContext<IOrderService>({} as IOrderService);

export const OrderService = ({ children }: any) => {
  const orderSocket = useRef(
    new WebSocket(
      `ws://${process.env.SERVER_IP}:${process.env.SERVER_PORT}/wsOrder`
    )
  );

  const orderService = useRef<IOrderService>({
    sendOrder(order: Order) {
      orderSocket.current.send(JSON.stringify(order));
    },
    async getOrderDescriptions(): Promise<OrderDescription[]> {
      return fetch(
        `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}/orders`
      )
        .then((response) => response.json())
        .then((orderDescriptions: OrderDescription[]) => {
          return orderDescriptions;
        });
    },
  });

  useEffect(() => {
    return () => {
      orderSocket.current.close();
    };
  }, []);
  return (
    <OrderContext.Provider value={orderService.current}>
      {children}
    </OrderContext.Provider>
  );
};
