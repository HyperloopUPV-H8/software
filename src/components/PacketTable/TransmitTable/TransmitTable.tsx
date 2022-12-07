import styles from "@components/PacketTable/TransmitTable/TransmitTable.module.scss";
import {
  OrderDropdown,
  FieldState,
} from "@components/PacketTable/TransmitTable/OrderDropdown";
import { OrderDescription } from "@adapters/OrderDescription";
import { OrderServiceContext } from "@services/OrderService";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";

export const TransmitTable = () => {
  const orderService = useContext(OrderServiceContext);
  const orderDescriptions = useSelector((state: RootState) => {
    return state.orders;
  });

  const createSendOrder = (orderDescription: OrderDescription) => {
    return (fields: FieldState[]) => {
      orderService.sendOrder({
        id: orderDescription.id,
        fields: fields.map((field) => {
          return { name: field.name, value: field.currentValue };
        }),
      });
    };
  };

  return (
    <div id={styles.wrapper}>
      {orderDescriptions.map((orderDescription) => {
        let sendOrder = createSendOrder(orderDescription);
        return (
          <OrderDropdown
            key={orderDescription.id}
            orderDescription={orderDescription}
            sendOrder={sendOrder}
          />
        );
      })}
    </div>
  );
};
