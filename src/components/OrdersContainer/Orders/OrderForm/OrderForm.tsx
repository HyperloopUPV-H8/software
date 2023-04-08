import styles from "./OrderForm.module.scss";
import { OrderDescription } from "adapters/Order";
import { Header } from "./Header/Header";
import { Fields } from "./Fields/Fields";
import { useState, useEffect } from "react";
import { Order } from "models/Order";
import { FormField, useFormFields } from "./useFormFields";

type Props = {
    orderDescription: OrderDescription;
    sendOrder: (order: Order) => void;
};

function createOrder(id: number, fields: FormField[]): Order {
    return {
        id: id,
        fields: Object.fromEntries(
            fields.map((field) => {
                return [
                    field.name,
                    { value: field.currentValue, isEnabled: field.isEnabled },
                ];
            })
        ),
    };
}

export const OrderForm = ({ orderDescription, sendOrder }: Props) => {
    const [fields, updateField, changeEnabled, isFormValid] = useFormFields(
        orderDescription.fields
    );
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    function toggleDropdown() {
        if (Object.keys(orderDescription.fields).length > 0) {
            setIsDropdownVisible((prevValue) => !prevValue);
        }
    }

    function trySendOrder() {
        if (isFormValid) {
            sendOrder(createOrder(orderDescription.id, fields));
        }
    }

    return (
        <div className={styles.orderFormWrapper}>
            <Header
                name={orderDescription.name}
                hasFields={fields.length > 0}
                isOpen={isDropdownVisible}
                toggleDropdown={toggleDropdown}
                isButtonEnabled={isFormValid}
                onButtonClick={() => {
                    trySendOrder();
                }}
            />
            {isDropdownVisible && (
                <Fields
                    fields={fields}
                    updateField={updateField}
                    changeEnabled={(name, value) => changeEnabled(name, value)}
                />
            )}
        </div>
    );
};
