import styles from "./OrderForm.module.scss";
import { OrderDescription } from "adapters/Order";
import { Header, HeaderInfo } from "./Header/Header";
import { Fields } from "./Fields/Fields";
import { useState, useRef, useCallback } from "react";
import { Order } from "models/Order";
import { FormField, useForm } from "./useForm";
import { useSpring } from "@react-spring/web";
import { useListenKey } from "./useListenKey";

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
    const { form, updateField, changeEnable } = useForm(description.fields);
    const [isOpen, setIsOpen] = useState(false);
    const [springs, api] = useSpring(() => ({
        from: { filter: "brightness(1)" },
        config: {
            tension: 600,
        },
    }));

    const trySendOrder = () => {
        if (form.isValid) {
            api.start({
                from: { filter: "brightness(1.2)" },
                to: { filter: "brightness(1)" },
            });

            sendOrder(createOrder(description.id, form.fields));
        }
    };

    const listen = useListenKey(" ", trySendOrder);

    const headerInfo: HeaderInfo =
        form.fields.length > 0
            ? {
                  type: "toggable",
                  isOpen: isOpen,
                  toggleDropdown: () => setIsOpen((prevValue) => !prevValue),
              }
            : { type: "fixed" };

    return (
        <div className={styles.orderFormWrapper}>
            <Header
                name={description.name}
                info={headerInfo}
                disabled={!form.isValid}
                onTargetClick={listen}
                onButtonClick={trySendOrder}
                springs={springs}
            />
            {isOpen && (
                <Fields
                    fields={form.fields}
                    updateField={updateField}
                    changeEnable={changeEnable}
                />
            )}
        </div>
    );
};
