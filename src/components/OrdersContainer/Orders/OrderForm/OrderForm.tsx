import styles from "./OrderForm.module.scss";
import { OrderDescription } from "adapters/Order";
import { Header } from "./Header/Header";
import { Fields } from "./Fields/Fields";
import { useState, useRef } from "react";
import { Order } from "models/Order";
import { FormField, useForm } from "./useForm";

type Props = {
    description: OrderDescription;
    sendOrder: (order: Order) => void;
};

function createOrder(id: number, fields: FormField[]): Order {
    return {
        id: id,
        fields: Object.fromEntries(
            fields.map((field) => {
                return [
                    field.id,
                    { value: field.value, isEnabled: field.isEnabled },
                ];
            })
        ),
    };
}

export const OrderForm = ({ description, sendOrder }: Props) => {
    const { form, dispatch } = useForm(description.fields);
    const [isExpanded, setIsExpanded] = useState(false);
    const keyListenerRef = useRef((ev: KeyboardEvent) => {
        if (ev.key == " ") {
            trySendOrder();
        }
    });

    function toggleDropdown() {
        if (Object.keys(description.fields).length > 0) {
            setIsExpanded((prevValue) => !prevValue);
        }
    }

    function trySendOrder() {
        if (form.isValid) {
            sendOrder(createOrder(description.id, form.fields));
        }
    }

    function changeAutomatic(isOn: boolean) {
        if (isOn) {
            document.addEventListener("keydown", keyListenerRef.current);
        } else {
            document.removeEventListener("keydown", keyListenerRef.current);
        }
    }

    return (
        <div className={styles.orderFormWrapper}>
            <Header
                name={description.name}
                hasFields={form.fields.length > 0}
                isOpen={isExpanded}
                toggleDropdown={toggleDropdown}
                disabled={!form.isValid}
                onTargetClick={changeAutomatic}
                onButtonClick={trySendOrder}
            />
            {isExpanded && (
                <Fields
                    fields={form.fields}
                    updateField={(id, value, isValid) =>
                        dispatch({
                            type: "update_field",
                            payload: { id, value, isValid },
                        })
                    }
                    changeEnabled={(id, value) =>
                        dispatch({
                            type: "change_enable",
                            payload: { id, value },
                        })
                    }
                />
            )}
        </div>
    );
};
