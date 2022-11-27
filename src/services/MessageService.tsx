import { OrderWebAdapter } from "@adapters/OrderDescription";
import { useEffect, createContext, useRef } from "react";
import { Order, createOrder } from "@models/Order";
import { setOrders } from "@slices/ordersSlice";
import { useDispatch } from "react-redux";
import { createConnection } from "@models/Connection";
import { updateConnection } from "@slices/connectionsSlice";

// interface IOrderService {
//   sendOrder(order: Order): void;
// }

// export const OrderServiceContext = createContext<IOrderService>(
//   {} as IOrderService
// );

export const MessageService = ({ children }: any) => {
  const dispatch = useDispatch();
  let messageSocket = useRef<WebSocket>();

  useEffect(() => {
    fetch(
      `http://${import.meta.env.VITE_SERVER_IP}:${
        import.meta.env.VITE_SERVER_PORT
      }${import.meta.env.VITE_MESSAGES_URL}`
    )
    //   .then((response) => response.json())
    //   .then((orderDescriptions: OrderWebAdapter[]) => {
    //     let orders: Order[] = [];
    //     for (let orderDescription of orderDescriptions) {
    //       let order = createOrder(orderDescription);
    //       orders.push(order);
    //     }
    //     dispatch(setOrders(orders));
    //   })
      .catch((reason) => {
        console.error(`Error fetching Messages: ${reason}`);
      });

    messageSocket.current = new WebSocket(
      `ws://${import.meta.env.VITE_SERVER_IP}:${
        import.meta.env.VITE_SERVER_PORT
      }${import.meta.env.VITE_MESSAGES_URL}`
    );
    dispatch(updateConnection(createConnection("Messages", false)));
    messageSocket.current.onopen = () => {
      dispatch(updateConnection(createConnection("Messages", true)));
    };

    // messageSocket.current.onmessage = (ev) => {
    //     let packetUpdates = JSON.parse(ev.data) as {
    //       [id: number]: PacketUpdate;
    //     };
    //     dispatch(updatePodData(packetUpdates));
    // };

    messageSocket.current.onclose = () => {
      dispatch(updateConnection(createConnection("Messages", false)));
    };

    return () => {
      if (messageSocket.current) {
        messageSocket.current.close();
      }
    };
  }, []);

  return <>{children}</>;
};