import styles from "@components/PacketTable/TransmitTable/OrderFields.module.scss";
import { OrderDescription } from "@adapters/OrderDescription";
import { OrderField } from "@components/PacketTable/TransmitTable/OrderField";
type Props = {
  orderDescription: OrderDescription;
  updateFieldState: (
    name: string,
    isValid: boolean,
    newValue: string | number | boolean
  ) => void;
};

export const OrderFields = ({ orderDescription, updateFieldState }: Props) => {
  return (
    <table className={styles.wrapper}>
      <tbody>
        {orderDescription.fieldDescriptions.map((field) => {
          return (
            <OrderField
              key={field.name}
              name={field.name}
              valueType={field.valueType}
              onChange={(
                isValid: boolean,
                newValue: string | number | boolean
              ) => {
                //FIXME: que sea mas obvio que la id es el name de la orden o hacerlo de otra manera mas explicita
                updateFieldState(field.name, isValid, newValue);
              }}
            />
          );
        })}
      </tbody>
    </table>
  );
};
