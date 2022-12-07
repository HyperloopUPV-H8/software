import { OrderDescription } from "@adapters/OrderDescription";
import { OrderHeader } from "@components/PacketTable/TransmitTable/OrderHeader";
import { OrderFields } from "@components/PacketTable/TransmitTable/OrderFields";
import styles from "@components/PacketTable/TransmitTable/OrderDropdown.module.scss";
import { useState, useEffect } from "react";

type Props = {
  orderDescription: OrderDescription;
  sendOrder: (fields: FieldState[]) => void;
};

export type FieldState = {
  name: string;
  isValid: boolean;
  currentValue: string | number | boolean;
};

export const OrderDropdown = ({ orderDescription, sendOrder }: Props) => {
  let [fieldStates, setFieldStates] = useState([] as FieldState[]);
  let [isDropdownVisible, setIsDropdownVisible] = useState(false);
  useEffect(() => {
    setFieldStates(
      orderDescription.fieldDescriptions.map((field) => {
        return {
          name: field.name,
          isValid: false,
          currentValue: 0,
        } as FieldState;
      })
    );
  }, []);

  function updateFieldState(
    name: string,
    isValid: boolean,
    newValue: string | number | boolean
  ) {
    setFieldStates((prevFieldStates) => {
      return prevFieldStates.map((fieldState) => {
        if (fieldState.name == name) {
          return { ...fieldState, isValid: isValid, currentValue: newValue };
        } else {
          return fieldState;
        }
      });
    });
  }

  function toggleDropdown() {
    setIsDropdownVisible((prevValue) => {
      return !prevValue;
    });
  }

  return (
    <div id={styles.wrapper}>
      <OrderHeader
        isCaretVisible={fieldStates.length > 0}
        toggleDropdown={toggleDropdown}
        isDropdownVisible={isDropdownVisible}
        name={orderDescription.name}
        sendOrder={() => {
          sendOrder(fieldStates);
        }}
      />
      {isDropdownVisible && (
        <OrderFields
          orderDescription={orderDescription}
          updateFieldState={updateFieldState}
        />
      )}
    </div>
  );
};
