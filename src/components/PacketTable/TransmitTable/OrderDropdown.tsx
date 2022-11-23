import { OrderDescription } from "@adapters/OrderDescription";

import styles from "@components/PacketTable/TransmitTable/OrderDropdown.module.scss";
import { OrderField } from "@components/PacketTable/TransmitTable/OrderField";
import { is } from "immer/dist/internal";
import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { Button } from "@components/FormComponents/Button";

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
      {Header(toggleDropdown, orderDescription.name, () => {
        sendOrder(fieldStates);
      })}
      {isDropdownVisible && Body(orderDescription, updateFieldState)}
    </div>
  );
};

function Header(
  toggleDropdown: () => void,
  name: string,
  sendOrder: () => void
): JSX.Element {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <div className={styles.caret} onClick={toggleDropdown}></div>
        <div className={styles.name}>{name}</div>
      </div>
      <div className={styles.right}>
        <Button onClick={sendOrder} />
      </div>
    </div>
  );
}

//FIXME: usar jsx.Element o React.ReactNode el mismo en todo el proyecto
function Body(
  orderDescription: OrderDescription,
  updateFieldState: (
    name: string,
    isValid: boolean,
    newValue: string | number | boolean
  ) => void
): JSX.Element {
  return (
    <table className={styles.body}>
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
}
