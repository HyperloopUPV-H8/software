import styles from "./OrderForm.module.scss";
import { OrderDescription } from "adapters/Order";
import { OrderHeader } from "./OrderHeader/OrderHeader";
import { OrderFields } from "./OrderFields/OrderFields";
import { useState, useEffect } from "react";
import { Order } from "models/Order";
import { FormField, useFormFields } from "./useFormFields";
import { FieldState } from "./useFormFields";
type Props = {
    orderDescription: OrderDescription;
    sendOrder: (order: Order) => void;
};

function createOrder(id: number, fields: FormField[]): Order {
    return {
        id: id,
        values: Object.fromEntries(
            fields.map((field) => {
                return [field.name, field.currentValue];
            })
        ),
    };
}

export const OrderForm = ({ orderDescription, sendOrder }: Props) => {
    let [fields, updateField, isFormValid] = useFormFields(
        orderDescription.fields
    );
    let [isDropdownVisible, setIsDropdownVisible] = useState(false);

    function toggleDropdown() {
        setIsDropdownVisible((prevValue) => !prevValue);
    }

    function trySendOrder() {
        if (isFormValid) {
            sendOrder(createOrder(orderDescription.id, fields));
        }
    }

    return (
        <div id={styles.wrapper}>
            <OrderHeader
                name={orderDescription.name}
                isCaretVisible={fields.length > 0}
                isCaretOpen={isDropdownVisible}
                toggleDropdown={toggleDropdown}
                isButtonEnabled={isFormValid}
                onButtonClick={() => {
                    trySendOrder();
                }}
            />
            {isDropdownVisible && (
                <OrderFields
                    fields={fields}
                    updateField={updateField}
                />
            )}
        </div>
    );
};
