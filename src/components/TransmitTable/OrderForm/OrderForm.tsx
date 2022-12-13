import { OrderDescription } from "@adapters/Order";
import { OrderHeader } from "@components/TransmitTable/OrderHeader/OrderHeader";
import { OrderFields } from "@components/TransmitTable/OrderFields/OrderFields";
import styles from "@components/TransmitTable/OrderForm/OrderForm.module.scss";
import { useState, useEffect } from "react";
import { Order } from "@models/Order";
import { useFormFields } from "./useFormFields";

type Props = {
  orderDescription: OrderDescription;
  sendOrder: (order: Order) => void;
};

export const OrderForm = ({ orderDescription, sendOrder }: Props) => {
  let [fields, updateField, areFieldsValid] = useFormFields(
    orderDescription.fieldDescriptions
  );
  let [isDropdownVisible, setIsDropdownVisible] = useState(false);
  let [isFormValid, setIsFormValid] = useState(false);

  function toggleDropdown() {
    setIsDropdownVisible((prevValue) => {
      return !prevValue;
    });
  }

  function trySendOrder(order: Order): boolean {
    if (areFieldsValid()) {
      sendOrder(order);
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    setIsFormValid(areFieldsValid());
  }, [fields]);

  return (
    <div id={styles.wrapper}>
      <OrderHeader
        isButtonEnabled={isFormValid}
        isCaretVisible={fields.length > 0}
        toggleDropdown={toggleDropdown}
        isCaretOpen={isDropdownVisible}
        name={orderDescription.name}
        sendOrder={() => {
          trySendOrder({
            id: orderDescription.id,
            fields: Object.fromEntries(
              fields.map((field) => {
                return [field.name, field.currentValue];
              })
            ),
          });
        }}
      />
      {isDropdownVisible && (
        <OrderFields fields={fields} updateField={updateField} />
      )}
    </div>
  );
};
